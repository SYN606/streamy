<script>
	let playlistUrl = $state('');
	let loading = $state(false);
	let playlistData = $state(null);
	let errorMsg = $state('');
	let selectedFormat = $state('bestvideo+bestaudio/best');

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
				throw new Error(data.message || 'Failed to parse playlist');
			}

			playlistData = data;
		} catch (err) {
			errorMsg = err.message || 'Something went wrong while fetching the playlist';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-3xl space-y-8 py-4">
	<!-- Header -->
	<div class="space-y-2 text-center">
		<span
			class="inline-block rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-cyan-400 uppercase"
		>
			Batch Downloader
		</span>
		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			Playlist <span class="text-sky-400">Extractor</span>
		</h1>
		<p class="mx-auto max-w-md text-sm text-slate-400">
			Paste a YouTube playlist URL to unpack all videos and download formats in bulk.
		</p>
	</div>

	<!-- Form Input -->
	<form
		onsubmit={handleFetchPlaylist}
		class="glass-panel flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:p-3"
	>
		<input
			type="url"
			bind:value={playlistUrl}
			placeholder="Paste YouTube Playlist URL..."
			required
			class="glass-input flex-1 rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={loading}
			class="glass-button flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white transition disabled:opacity-50"
		>
			{#if loading}
				<svg class="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				<span>Parsing Playlist...</span>
			{:else}
				<span>Fetch Tracks</span>
			{/if}
		</button>
	</form>

	<!-- Error Alert -->
	{#if errorMsg}
		<div
			class="rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-center text-xs text-red-400"
		>
			{errorMsg}
		</div>
	{/if}

	<!-- Results List -->
	{#if playlistData}
		<div class="space-y-4">
			<!-- Playlist Meta Summary -->
			<div
				class="glass-panel flex flex-col items-start justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center"
			>
				<div class="space-y-1">
					<h2 class="text-lg leading-tight font-bold text-white">{playlistData.title}</h2>
					<p class="text-xs text-slate-400">
						By {playlistData.uploader} •
						<span class="font-semibold text-sky-400">{playlistData.totalCount} items</span>
					</p>
				</div>

				<div class="flex w-full items-center gap-3 sm:w-auto">
					<select
						bind:value={selectedFormat}
						class="glass-input rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
					>
						<option value="bestvideo+bestaudio/best">Video (MP4 High)</option>
						<option value="bestaudio/best">Audio Only (MP3/M4A)</option>
					</select>
				</div>
			</div>

			<!-- Track Items -->
			<div class="space-y-2">
				{#each playlistData.entries as track, idx (track.id)}
					<div class="glass-card flex items-center justify-between gap-4 rounded-xl p-3 sm:p-4">
						<div class="flex items-center gap-3 overflow-hidden">
							<span class="w-6 shrink-0 text-center font-mono text-xs font-bold text-slate-500">
								{(idx + 1).toString().padStart(2, '0')}
							</span>
							<div class="space-y-0.5 truncate">
								<h3 class="truncate text-xs font-semibold text-white sm:text-sm">{track.title}</h3>
								<p class="text-[11px] text-slate-400">{track.uploader} • {track.duration}</p>
							</div>
						</div>

						<a
							href="/api/download?url={encodeURIComponent(track.url)}&format={selectedFormat}"
							download
							class="glass-button shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-medium text-white"
						>
							Download
						</a>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
