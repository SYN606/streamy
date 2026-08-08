<script>
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	let playlistUrl = $state('');
	let loading = $state(false);
	let playlistData = $state(null);
	let errorMsg = $state('');
	let selectedFormat = $state('bestvideo+bestaudio/best');

	// Real-time batch downloading state
	let isDownloading = $state(false);
	let currentTrackIndex = $state(0);
	let progress = $state(0);

	async function handleFetchPlaylist(e) {
		e.preventDefault();
		if (!playlistUrl.trim()) return;

		loading = true;
		errorMsg = '';
		playlistData = null;

		try {
			const res = await fetch('/api/playlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: playlistUrl })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Failed to analyze playlist');
			}

			playlistData = data;
		} catch (err) {
			errorMsg = err.message || 'Something went wrong while fetching the playlist.';
		} finally {
			loading = false;
		}
	}

	function handleDownloadTrack(trackUrl, index) {
		currentTrackIndex = index;
		isDownloading = true;
		progress = 0;

		const sseUrl = `/api/progress?url=${encodeURIComponent(trackUrl)}&format=${encodeURIComponent(selectedFormat)}`;
		const eventSource = new EventSource(sseUrl);

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.percent !== undefined) {
				progress = data.percent;
			}

			if (data.done) {
				eventSource.close();
				setTimeout(() => {
					isDownloading = false;
				}, 1200);
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			isDownloading = false;
			errorMsg = 'Download connection interrupted. Please try again.';
		};
	}
</script>

<div class="mx-auto max-w-3xl space-y-8 py-4">
	<!-- Hero Section -->
	<div class="space-y-3 text-center">
		<span
			class="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-400 backdrop-blur-md"
		>
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400"></span>
			Batch Converter
		</span>

		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
			Playlist <span class="bg-linear-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent"
				>Extractor</span
			>
		</h1>
		<p class="mx-auto max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
			Paste any YouTube playlist link to inspect tracks and extract video or audio files.
		</p>
	</div>

	<!-- Input Form -->
	<form
		onsubmit={handleFetchPlaylist}
		class="glass-panel flex flex-col gap-2.5 rounded-2xl p-2 shadow-2xl sm:flex-row sm:p-3"
	>
		<input
			type="url"
			bind:value={playlistUrl}
			placeholder="Paste YouTube playlist link here..."
			required
			class="glass-input flex-1 rounded-xl border border-white/10 px-4 py-3.5 text-base placeholder-slate-400 focus:border-sky-400 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={loading || isDownloading}
			class="glass-button flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition disabled:opacity-50"
		>
			{#if loading}
				<svg class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				<span>Parsing...</span>
			{:else}
				<span>Fetch Playlist</span>
			{/if}
		</button>
	</form>

	<!-- Error Alert -->
	{#if errorMsg}
		<div
			class="glass-card rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-center text-sm font-medium text-red-300 shadow-xl"
		>
			{errorMsg}
		</div>
	{/if}

	<!-- Active Progress Stream -->
	<ProgressBar {progress} {isDownloading} label="Downloading Track #{currentTrackIndex + 1}..." />

	<!-- Playlist Track List -->
	{#if playlistData}
		<div class="space-y-4">
			<!-- Playlist Meta Header Card -->
			<div
				class="glass-panel flex flex-col gap-4 rounded-2xl p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="space-y-1">
					<h2 class="text-xl font-extrabold text-white">{playlistData.title}</h2>
					<p class="text-xs font-medium text-slate-300">
						By <span class="font-semibold text-white">{playlistData.uploader}</span> •
						<span class="font-semibold text-sky-400"
							>{playlistData.entries?.length || 0} Tracks</span
						>
					</p>
				</div>

				<!-- Format Selector -->
				<div class="flex items-center gap-2">
					<select
						bind:value={selectedFormat}
						class="glass-input rounded-xl border border-white/15 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-100 focus:outline-none"
					>
						<option value="bestvideo+bestaudio/best">Video (MP4 HD)</option>
						<option value="bestaudio/best">Audio (MP3/M4A)</option>
					</select>
				</div>
			</div>

			<!-- Track Item Cards -->
			<div class="space-y-2.5">
				{#each playlistData.entries as track, idx (track.id || idx)}
					<div class="glass-card flex items-center justify-between gap-4 rounded-xl p-3.5 sm:p-4">
						<div class="flex items-center gap-3.5 overflow-hidden">
							<span
								class="w-6 shrink-0 text-center font-mono text-xs font-extrabold text-slate-400"
							>
								{(idx + 1).toString().padStart(2, '0')}
							</span>
							<div class="space-y-0.5 truncate">
								<h3 class="truncate text-sm font-bold text-white">{track.title}</h3>
								<p class="text-xs text-slate-300">
									{track.uploader || 'YouTube'} • {track.duration || 'N/A'}
								</p>
							</div>
						</div>

						<button
							onclick={() => handleDownloadTrack(track.url, idx)}
							disabled={isDownloading}
							class="glass-button shrink-0 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
						>
							Download
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
