<script>
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import PlaylistForm from '$lib/components/playlist/PlaylistForm.svelte';
	import PlaylistHeader from '$lib/components/playlist/PlaylistHeader.svelte';
	import TrackItem from '$lib/components/playlist/TrackItem.svelte';

	import { Icon } from 'svelte-icons-pack';
	import {
		LuZap,
		LuSparkles,
		LuShield,
		LuVideo,
		LuMusic,
		LuTriangleAlert,
		LuCircleCheck,
		LuListMusic,
		LuDownload,
		LuSquare
	} from 'svelte-icons-pack/lu';

	let playlistUrl = $state('');
	let loading = $state(false);
	let playlistData = $state(null);
	let errorMsg = $state('');
	let selectedFormat = $state('bestvideo+bestaudio/best');

	// Batch selection & downloading state
	let selectedTrackIds = $state(new Set());
	let isDownloading = $state(false);
	let currentTrackIndex = $state(-1);
	let currentBatchStep = $state(0);
	let totalBatchCount = $state(0);
	let progress = $state(0);

	const highlights = [
		{
			title: 'Batch Extraction',
			desc: 'Analyze and extract full YouTube or SoundCloud playlists in a single click.',
			icon: LuListMusic
		},
		{
			title: 'Multi-Format Support',
			desc: 'Convert entire audio albums to 320kbps MP3s or video series up to 4K HD.',
			icon: LuVideo
		},
		{
			title: 'Live Progress Tracking',
			desc: 'Monitor per-track progress, total status, and download events in real-time.',
			icon: LuZap
		}
	];

	async function handleFetchPlaylist(e) {
		e?.preventDefault();
		if (!playlistUrl.trim()) return;

		loading = true;
		errorMsg = '';
		playlistData = null;
		selectedTrackIds = new Set();

		try {
			const res = await fetch('/api/playlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: playlistUrl })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Failed to analyze playlist URL');
			}

			playlistData = data;
			// Select all tracks by default
			if (data.entries && Array.isArray(data.entries)) {
				selectedTrackIds = new Set(data.entries.map((_, i) => i));
			}
		} catch (err) {
			errorMsg = err.message || 'Something went wrong while processing the playlist.';
		} finally {
			loading = false;
		}
	}

	function toggleTrackSelection(index) {
		const updated = new Set(selectedTrackIds);
		if (updated.has(index)) {
			updated.delete(index);
		} else {
			updated.add(index);
		}
		selectedTrackIds = updated;
	}

	function toggleSelectAll() {
		if (!playlistData?.entries) return;
		if (selectedTrackIds.size === playlistData.entries.length) {
			selectedTrackIds = new Set();
		} else {
			selectedTrackIds = new Set(playlistData.entries.map((_, i) => i));
		}
	}

	// Download a single track via SSE
	function downloadTrackPromise(trackUrl, index) {
		return new Promise((resolve, reject) => {
			currentTrackIndex = index;
			progress = 0;

			const sseUrl = `/api/progress?url=${encodeURIComponent(trackUrl)}&format=${encodeURIComponent(selectedFormat)}`;
			const eventSource = new EventSource(sseUrl);

			eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);

					if (data.percent !== undefined) {
						progress = data.percent;
					}

					if (data.done) {
						eventSource.close();
						resolve();
					}
				} catch (err) {
					console.error('SSE JSON parse error:', err);
				}
			};

			eventSource.onerror = () => {
				eventSource.close();
				reject(new Error(`Failed to download track #${index + 1}`));
			};
		});
	}

	// Download a single track individually
	async function handleDownloadSingle(trackUrl, index) {
		if (isDownloading) return;
		isDownloading = true;
		currentBatchStep = 1;
		totalBatchCount = 1;
		errorMsg = '';

		try {
			await downloadTrackPromise(trackUrl, index);
		} catch (err) {
			errorMsg = err.message || 'Download connection interrupted.';
		} finally {
			setTimeout(() => {
				isDownloading = false;
				currentTrackIndex = -1;
			}, 1000);
		}
	}

	// Download all selected tracks sequentially
	async function handleBatchDownload() {
		if (!playlistData?.entries || selectedTrackIds.size === 0 || isDownloading) return;

		isDownloading = true;
		errorMsg = '';
		const indicesToDownload = Array.from(selectedTrackIds).sort((a, b) => a - b);
		totalBatchCount = indicesToDownload.length;

		for (let i = 0; i < indicesToDownload.length; i++) {
			const trackIdx = indicesToDownload[i];
			const track = playlistData.entries[trackIdx];
			currentBatchStep = i + 1;

			try {
				await downloadTrackPromise(track.url, trackIdx);
			} catch (err) {
				errorMsg = `Batch paused: ${err.message}`;
				break;
			}
		}

		setTimeout(() => {
			isDownloading = false;
			currentTrackIndex = -1;
		}, 1200);
	}
</script>

<div class="mx-auto max-w-5xl space-y-10 py-6">
	<!-- Playlist Hero Header -->
	<div class="space-y-4 text-center">
		<div class="flex justify-center">
			<span
				class="inline-flex items-center gap-2 rounded-full border border-glass-border bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-accent uppercase shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md"
			>
				{#if LuListMusic}
					<Icon src={LuListMusic} className="w-4 h-4 text-cyan-300" />
				{/if}
				<span>Batch Playlist Extractor</span>
			</span>
		</div>

		<h1 class="text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-tight">
			Download Full <br class="hidden sm:inline" />
			<span
				class="bg-linear-to-r from-cyan-accent via-sky-glow to-blue-glow bg-clip-text text-transparent"
			>
				Playlists & Albums
			</span>
		</h1>

		<p class="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
			Paste any YouTube or supported playlist link below to extract all tracks in bulk. Select
			individual videos or convert the whole playlist into high-quality MP3s or MP4s.
		</p>

		<!-- Trust Badges -->
		<div
			class="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-400"
		>
			<span class="flex items-center gap-1.5">
				{#if LuShield}
					<Icon src={LuShield} className="w-4 h-4 text-emerald-400" />
				{/if}
				100% Ad-Free & Direct
			</span>
			<span class="flex items-center gap-1.5">
				{#if LuZap}
					<Icon src={LuZap} className="w-4 h-4 text-cyan-400" />
				{/if}
				Bulk Parallel Analysis
			</span>
			<span class="flex items-center gap-1.5">
				{#if LuCircleCheck}
					<Icon src={LuCircleCheck} className="w-4 h-4 text-blue-400" />
				{/if}
				No Track Limits
			</span>
		</div>
	</div>

	<!-- Main Playlist Input Console -->
	<div class="space-y-4">
		<PlaylistForm bind:playlistUrl {loading} {isDownloading} onFetch={handleFetchPlaylist} />

		<!-- Error Alert -->
		{#if errorMsg}
			<div
				class="glass-card flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-center text-sm font-medium text-red-300 shadow-xl"
			>
				{#if LuTriangleAlert}
					<Icon src={LuTriangleAlert} className="w-4 h-4 shrink-0 text-red-400" />
				{/if}
				<span>{errorMsg}</span>
			</div>
		{/if}

		<!-- Active Progress Stream -->
		{#if isDownloading}
			<ProgressBar
				{progress}
				{isDownloading}
				label="Batch Item {currentBatchStep}/{totalBatchCount} — Downloading Track #{currentTrackIndex +
					1}..."
			/>
		{/if}
	</div>

	<!-- Media Processing Results & Batch Controls -->
	{#if playlistData}
		<div class="space-y-6">
			<PlaylistHeader
				title={playlistData.title}
				uploader={playlistData.uploader}
				trackCount={playlistData.entries?.length || 0}
				bind:selectedFormat
			/>

			<!-- Batch Action Bar -->
			<div
				class="glass-panel-glow flex flex-col items-center justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:px-6"
			>
				<div class="flex items-center gap-3">
					<button
						type="button"
						onclick={toggleSelectAll}
						class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
					>
						{#if selectedTrackIds.size === playlistData.entries.length}
							{#if LuCircleCheck}
								<Icon src={LuCircleCheck} className="w-4 h-4 text-cyan-400" />
							{/if}
							<span>Deselect All</span>
						{:else}
							{#if LuSquare}
								<Icon src={LuSquare} className="w-4 h-4 text-slate-400" />
							{/if}
							<span>Select All</span>
						{/if}
					</button>
					<span class="text-xs font-medium text-slate-300">
						<strong class="text-cyan-300">{selectedTrackIds.size}</strong> of {playlistData.entries
							.length} tracks selected
					</span>
				</div>

				<button
					type="button"
					disabled={isDownloading || selectedTrackIds.size === 0}
					onclick={handleBatchDownload}
					class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-linear-to-r from-cyan-500/20 to-blue-600/20 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md transition hover:scale-[1.02] hover:border-cyan-400/50 disabled:opacity-50 sm:w-auto"
				>
					{#if LuDownload}
						<Icon src={LuDownload} className="w-4 h-4 text-cyan-300" />
					{/if}
					<span>Download Selected ({selectedTrackIds.size})</span>
				</button>
			</div>

			<!-- Track List with Selection Checkboxes -->
			<div class="space-y-2.5">
				{#each playlistData.entries as track, idx (track.id || idx)}
					<div class="flex items-center gap-3">
						<button
							type="button"
							onclick={() => toggleTrackSelection(idx)}
							class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
						>
							{#if selectedTrackIds.has(idx)}
								{#if LuCircleCheck}
									<Icon src={LuCircleCheck} className="w-5 h-5 text-cyan-400" />
								{/if}
							{:else}
								{#if LuSquare}
									<Icon src={LuSquare} className="w-5 h-5 text-slate-500" />
								{/if}
							{/if}
						</button>
						<div class="grow">
							<TrackItem
								{track}
								index={idx}
								{isDownloading}
								onDownload={() => handleDownloadSingle(track.url, idx)}
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Feature Showcase Grid -->
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
</div>
