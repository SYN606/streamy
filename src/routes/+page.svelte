<script>
	import HeroHeader from '$lib/components/home/HeroHeader.svelte';
	import MediaInputConsole from '$lib/components/home/MediaInputConsole.svelte';
	import VideoPreviewCard from '$lib/components/home/VideoPreviewCard.svelte';

	import { Icon } from 'svelte-icons-pack';
	import { LuVideo, LuMusic, LuZap, LuLayers, LuArrowRight } from 'svelte-icons-pack/lu';

	// State using Svelte 5 Runes
	let mediaUrl = $state('');
	let loading = $state(false);
	let video = $state(null);
	let errorMsg = $state('');
	let selectedFormat = $state('mp3-320');

	// Download & SSE state
	let isDownloading = $state(false);
	let progress = $state(0);
	let downloadComplete = $state(false);
	let resultContainer = $state(null);

	const highlights = [
		{
			title: '4K Ultra HD Video',
			desc: 'Preserve full resolution video up to 60fps in WebM or MP4 containers with zero loss.',
			icon: LuVideo
		},
		{
			title: '320kbps Audio Core',
			desc: 'Extract uncompressed, high-bitrate MP3 or AAC tracks with complete embedded metadata.',
			icon: LuMusic
		},
		{
			title: 'Live Stream Telemetry',
			desc: 'Track transcoding percentages, conversion throughput, and download status in real time.',
			icon: LuZap
		}
	];

	/**
	 * Ensures clean single video context if user pastes a URL with playlist parameters
	 */
	function sanitizeSingleUrl(rawUrl) {
		try {
			const parsed = new URL(rawUrl.trim());
			if (parsed.searchParams.has('v')) {
				const videoId = parsed.searchParams.get('v');
				return `https://www.youtube.com/watch?v=${videoId}`;
			}
			return rawUrl.trim();
		} catch {
			return rawUrl.trim();
		}
	}

	function handleClearInput() {
		mediaUrl = '';
		video = null;
		errorMsg = '';
		downloadComplete = false;
	}

	/**
	 * Fetch Media Information from API
	 */
	async function handleFetchMedia(e) {
		e?.preventDefault();
		const cleanUrl = sanitizeSingleUrl(mediaUrl);

		if (!cleanUrl) return;

		loading = true;
		errorMsg = '';
		video = null;
		downloadComplete = false;

		try {
			const res = await fetch('/api/info', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: cleanUrl })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Unable to extract video information.');
			}

			video = data;
			selectedFormat = data?.formats?.[0]?.format_id || 'mp3-320';

			setTimeout(() => {
				resultContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
		} catch (err) {
			errorMsg =
				err.message || 'Failed to process media link. Please verify the URL and try again.';
		} finally {
			loading = false;
		}
	}

	/**
	 * Save successful extraction to localStorage
	 */
	function saveToHistory() {
		if (!video) return;

		try {
			const existing = JSON.parse(localStorage.getItem('streamy_history') || '[]');
			const fmtObj = video.formats?.find((f) => f.format_id === selectedFormat);

			const newItem = {
				id: `${video.id}_${Date.now()}`,
				title: video.title,
				thumbnail: video.thumbnail,
				url: mediaUrl,
				formatId: selectedFormat,
				format: fmtObj?.resolution || 'HQ Stream',
				timestamp: new Date().toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			};

			const updated = [newItem, ...existing.filter((i) => i.id !== newItem.id)].slice(0, 30);
			localStorage.setItem('streamy_history', JSON.stringify(updated));
		} catch (e) {
			console.error('Failed saving download record to history:', e);
		}
	}

	/**
	 * Trigger browser file prompt once backend server stream/conversion finishes
	 */
	function triggerFileDownload(cleanUrl) {
		const endpoint = `/api/download?url=${encodeURIComponent(cleanUrl)}&format_id=${encodeURIComponent(selectedFormat)}`;
		const anchor = document.createElement('a');
		anchor.href = endpoint;
		anchor.setAttribute('download', '');
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	}

	/**
	 * Initiate SSE stream progress and start media download
	 */
	function handleStartDownload() {
		if (!video || !mediaUrl) return;

		saveToHistory();
		isDownloading = true;
		downloadComplete = false;
		progress = 0;

		const cleanUrl = sanitizeSingleUrl(mediaUrl);
		const sseUrl = `/api/progress?url=${encodeURIComponent(cleanUrl)}&format_id=${encodeURIComponent(selectedFormat)}`;
		const eventSource = new EventSource(sseUrl);
		let isDone = false;

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				if (data.percent !== undefined) {
					progress = data.percent;
				}

				if (data.done) {
					isDone = true;
					eventSource.close();
					progress = 100;
					downloadComplete = true;

					// Deliver file to client browser
					triggerFileDownload(cleanUrl);

					setTimeout(() => {
						isDownloading = false;
					}, 2000);
				}
			} catch (err) {
				console.error('SSE parsing error:', err);
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			if (isDone) return; // Prevent spurious error trigger upon normal close
			isDownloading = false;
			errorMsg = 'Download stream timed out or was interrupted. Please attempt the download again.';
		};
	}
</script>

<div class="mx-auto max-w-4xl space-y-10 py-6">
	<!-- Hero Header -->
	<HeroHeader />

	<!-- Main Input Console -->
	<MediaInputConsole
		bind:mediaUrl
		bind:errorMsg
		{loading}
		{isDownloading}
		{downloadComplete}
		{progress}
		onSubmit={handleFetchMedia}
		onClear={handleClearInput}
	/>

	<!-- Single Video Preview & Format Selection -->
	<VideoPreviewCard
		{video}
		bind:selectedFormat
		mediaUrl={sanitizeSingleUrl(mediaUrl)}
		onDownload={handleStartDownload}
		bind:resultContainer
	/>

	<!-- Technical Features Showcase -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		{#each highlights as item}
			<div class="glass-card space-y-2.5 rounded-2xl p-6">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-cyan-500/10 text-cyan-300 shadow-inner"
				>
					{#if item.icon}
						<Icon src={item.icon} className="w-5 h-5" />
					{/if}
				</div>
				<h3 class="text-base font-bold text-white">{item.title}</h3>
				<p class="text-xs leading-relaxed text-slate-300 sm:text-sm">
					{item.desc}
				</p>
			</div>
		{/each}
	</div>

	<!-- Batch Processing Redirect Banner -->
	<div
		class="glass-panel-glow flex flex-col items-center justify-between gap-4 rounded-3xl p-6 text-center sm:flex-row sm:p-8 sm:text-left"
	>
		<div class="space-y-1">
			<span class="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase">
				{#if LuLayers}
					<Icon src={LuLayers} className="w-3.5 h-3.5 text-cyan-400" />
				{/if}
				Batch Mode Available
			</span>
			<h3 class="text-lg font-bold text-white">Need to convert an entire playlist?</h3>
			<p class="text-xs text-slate-300">
				Switch to batch processing to extract full YouTube playlists or music albums in one click.
			</p>
		</div>
		<a
			href="/playlist"
			class="glass-button flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white transition"
		>
			<span>Playlist Extractor</span>
			{#if LuArrowRight}
				<Icon src={LuArrowRight} className="w-3.5 h-3.5" />
			{/if}
		</a>
	</div>
</div>
