<script>
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import FormatSelector from '$lib/components/FormatSelector.svelte';

	import { Icon } from 'svelte-icons-pack';
	import {
		LuZap,
		LuSparkles,
		LuShield,
		LuArrowRight,
		LuVideo,
		LuMusic,
		LuTriangleAlert,
		LuCircleCheck,
		LuLayers,
		LuDownload,
		LuSearch,
		LuX,
		LuClipboard
	} from 'svelte-icons-pack/lu';

	// State Variables using Svelte 5 Runes
	let mediaUrl = $state('');
	let loading = $state(false);
	let video = $state(null);
	let errorMsg = $state('');
	let selectedFormat = $state('mp3-320');

	// Real-Time SSE Download State
	let isDownloading = $state(false);
	let progress = $state(0);
	let downloadComplete = $state(false);

	// Template DOM Node Reference
	let resultContainer = $state(null);

	const highlights = [
		{
			title: '4K Ultra HD',
			desc: 'Extract high-resolution MP4/WebM video streams without quality loss.',
			icon: LuVideo
		},
		{
			title: '320kbps Audio',
			desc: 'Convert directly to pristine, high-bitrate MP3 or AAC tracks with full metadata.',
			icon: LuMusic
		},
		{
			title: 'Live Download SSE',
			desc: 'Real-time conversion feedback, download speeds, and progress tracking.',
			icon: LuZap
		}
	];

	/**
	 * Sanitize input URL to ensure single video context if user accidentally pastes playlist link
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

	/**
	 * Paste from user clipboard directly into the input field
	 */
	async function handlePasteFromClipboard() {
		try {
			const text = await navigator.clipboard.readText();
			if (text) {
				mediaUrl = text;
				errorMsg = '';
			}
		} catch (err) {
			console.warn('Clipboard read error:', err);
		}
	}

	/**
	 * Clear input state
	 */
	function handleClearInput() {
		mediaUrl = '';
		video = null;
		errorMsg = '';
		downloadComplete = false;
	}

	/**
	 * Fetch Video Metadata from API
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
				throw new Error(data.message || 'Failed to extract video information');
			}

			video = data;
			selectedFormat = data?.formats?.[0]?.format_id || 'mp3-320';

			setTimeout(() => {
				resultContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
		} catch (err) {
			errorMsg =
				err.message ||
				'Something went wrong while processing the link. Please check the URL and try again.';
		} finally {
			loading = false;
		}
	}

	/**
	 * Save successful downloads to localStorage history
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
			console.error('Failed to save download history:', e);
		}
	}

	/**
	 * Trigger backend conversion/download stream with live SSE updates
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

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				if (data.percent !== undefined) {
					progress = data.percent;
				}

				if (data.done) {
					eventSource.close();
					progress = 100;
					downloadComplete = true;
					setTimeout(() => {
						isDownloading = false;
					}, 2000);
				}
			} catch (err) {
				console.error('SSE JSON parse error:', err);
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			isDownloading = false;
			errorMsg = 'Download connection timed out or failed. Please try downloading again.';
		};
	}
</script>

<div class="mx-auto max-w-4xl space-y-10 py-6">
	<!-- Hero Header -->
	<div class="space-y-4 text-center">
		<div class="flex justify-center">
			<span
				class="inline-flex items-center gap-2 rounded-full border border-glass-border bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-accent uppercase shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md"
			>
				{#if LuSparkles}
					<Icon src={LuSparkles} className="w-3.5 h-3.5 text-cyan-300" />
				{/if}
				<span>Single Video & Audio Extractor</span>
			</span>
		</div>

		<h1 class="text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-tight">
			Convert Any <br class="hidden sm:inline" />
			<span
				class="bg-linear-to-r from-cyan-accent via-sky-glow to-blue-glow bg-clip-text text-transparent"
			>
				YouTube & Music Link
			</span>
		</h1>

		<p class="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
			Paste any single YouTube video or YouTube Music URL below to download high-quality MP4 video
			streams or high-bitrate MP3 audio.
		</p>

		<!-- Trust Badges -->
		<div
			class="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-400"
		>
			<span class="flex items-center gap-1.5">
				{#if LuShield}
					<Icon src={LuShield} className="w-4 h-4 text-emerald-400" />
				{/if}
				100% Free & Safe
			</span>
			<span class="flex items-center gap-1.5">
				{#if LuZap}
					<Icon src={LuZap} className="w-4 h-4 text-cyan-400" />
				{/if}
				Fast Direct Streams
			</span>
			<span class="flex items-center gap-1.5">
				{#if LuCircleCheck}
					<Icon src={LuCircleCheck} className="w-4 h-4 text-blue-400" />
				{/if}
				No Account Required
			</span>
		</div>
	</div>

	<!-- Main Input Console -->
	<div class="space-y-4">
		<form
			onsubmit={handleFetchMedia}
			class="glass-panel relative flex items-center rounded-2xl p-2 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-cyan-500/50"
		>
			<div class="relative flex flex-1 items-center">
				<input
					type="url"
					bind:value={mediaUrl}
					placeholder="Paste YouTube video or track link (e.g., https://youtube.com/watch?v=...)"
					required
					disabled={loading || isDownloading}
					class="w-full bg-transparent px-4 py-3 pr-16 text-sm text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
				/>

				<div class="absolute right-2 flex items-center gap-1">
					{#if mediaUrl}
						<button
							type="button"
							onclick={handleClearInput}
							disabled={loading || isDownloading}
							class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
							title="Clear input"
						>
							{#if LuX}
								<Icon src={LuX} className="w-4 h-4" />
							{/if}
						</button>
					{:else}
						<button
							type="button"
							onclick={handlePasteFromClipboard}
							disabled={loading || isDownloading}
							class="flex cursor-pointer items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/15 hover:text-white"
							title="Paste from clipboard"
						>
							{#if LuClipboard}
								<Icon src={LuClipboard} className="w-3.5 h-3.5" />
							{/if}
							<span class="hidden sm:inline">Paste</span>
						</button>
					{/if}
				</div>
			</div>

			<button
				type="submit"
				disabled={loading || isDownloading || !mediaUrl.trim()}
				class="glass-button flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white transition disabled:opacity-50"
			>
				{#if loading}
					<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></span>
					<span>Analyzing...</span>
				{:else}
					{#if LuSearch}
						<Icon src={LuSearch} className="w-4 h-4" />
					{/if}
					<span>Extract</span>
				{/if}
			</button>
		</form>

		<!-- Error Alert Container -->
		{#if errorMsg}
			<div
				class="glass-card flex items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-sm font-medium text-red-200 shadow-xl"
			>
				<div class="flex items-center gap-2.5">
					{#if LuTriangleAlert}
						<Icon src={LuTriangleAlert} className="w-5 h-5 shrink-0 text-red-400" />
					{/if}
					<span>{errorMsg}</span>
				</div>
				<button
					type="button"
					onclick={() => (errorMsg = '')}
					class="rounded-lg p-1 text-red-300 transition hover:bg-red-900/50 hover:text-white"
				>
					{#if LuX}
						<Icon src={LuX} className="w-4 h-4" />
					{/if}
				</button>
			</div>
		{/if}

		<!-- Download Completion Notification -->
		{#if downloadComplete && !isDownloading}
			<div
				class="glass-card flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm font-medium text-emerald-200 shadow-xl"
			>
				{#if LuCircleCheck}
					<Icon src={LuCircleCheck} className="w-5 h-5 shrink-0 text-emerald-400" />
				{/if}
				<span>Download started! Check your browser's downloads folder.</span>
			</div>
		{/if}

		<!-- Active Progress Bar Component -->
		{#if isDownloading}
			<ProgressBar {progress} {isDownloading} label="Processing & Streaming File..." />
		{/if}
	</div>

	<!-- Single Video Preview Card & Format Selection -->
	{#if video}
		<div
			bind:this={resultContainer}
			class="glass-panel space-y-6 rounded-3xl p-6 shadow-2xl sm:p-8"
		>
			<div class="flex flex-col items-start gap-5 sm:flex-row">
				<div
					class="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-lg sm:w-64"
				>
					<img src={video.thumbnail} alt={video.title} class="h-full w-full object-cover" />
					{#if video.duration && video.duration !== 'N/A'}
						<span
							class="absolute right-2.5 bottom-2.5 rounded-md border border-white/15 bg-black/80 px-2 py-0.5 font-mono text-xs font-medium text-white backdrop-blur-md"
						>
							{video.duration}
						</span>
					{/if}
				</div>

				<div class="flex-1 space-y-2">
					<h2 class="text-lg leading-snug font-bold tracking-tight text-white sm:text-xl">
						{video.title}
					</h2>
					<p class="flex items-center gap-1.5 text-sm text-slate-300">
						<span class="text-slate-400">Artist / Channel:</span>
						<span class="font-medium text-white">{video.artist || 'Unknown Artist'}</span>
					</p>
					{#if video.album && video.album !== 'Single'}
						<p class="text-xs text-slate-400">
							Album: <span class="text-slate-200">{video.album}</span>
						</p>
					{/if}
				</div>
			</div>

			<!-- Format Selector Box -->
			{#if video.formats && video.formats.length > 0}
				<div class="space-y-3 pt-2">
					<label
						for="format-select-label"
						id="format-select-label"
						class="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
					>
						Select Output Quality & Format
					</label>
					<FormatSelector formats={video.formats} bind:selectedFormat />
				</div>
			{/if}

			<!-- Download Button -->
			<div class="pt-2">
				<a
					href="/api/download?url={encodeURIComponent(
						sanitizeSingleUrl(mediaUrl)
					)}&format_id={selectedFormat}"
					download
					onclick={handleStartDownload}
					class="glass-button flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold tracking-wide text-white transition active:scale-[0.99]"
				>
					{#if LuDownload}
						<Icon src={LuDownload} className="w-4 h-4" />
					{:else}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
					{/if}
					<span>Download Selected Format</span>
				</a>
			</div>
		</div>
	{/if}

	<!-- Features Showcase Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		{#each highlights as item}
			<div class="glass-card space-y-2.5 rounded-2xl p-6">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-cyan-500/10 text-cyan-300 shadow-inner"
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

	<!-- Redirect Banner for Multi-Track Playlists -->
	<div
		class="glass-panel-glow flex flex-col items-center justify-between gap-4 rounded-3xl p-6 text-center sm:flex-row sm:p-8 sm:text-left"
	>
		<div class="space-y-1">
			<span class="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase">
				{#if LuLayers}
					<Icon src={LuLayers} className="w-3.5 h-3.5 text-cyan-400" />
				{/if}
				Batch Mode
			</span>
			<h3 class="text-lg font-bold text-white">Need to download an entire playlist?</h3>
			<p class="text-xs text-slate-300">
				Switch to batch processing to convert full albums or video playlists in one go.
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
