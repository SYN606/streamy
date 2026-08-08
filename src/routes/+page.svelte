<script>
	let url = $state('');
	let loading = $state(false);
	let videoData = $state(null);
	let errorMsg = $state('');

	async function handleSubmit(e) {
		e.preventDefault();
		if (!url.trim()) return;

		loading = true;
		errorMsg = '';
		videoData = null;

		try {
			const res = await fetch('/api/info', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Failed to analyze video');
			}

			videoData = data;
		} catch (err) {
			errorMsg = err.message || 'Something went wrong';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl space-y-8">
	<!-- Hero Header -->
	<div class="space-y-2 text-center">
		<h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
			Download YouTube Media <span class="text-red-500">Instantly</span>
		</h1>
		<p class="text-sm text-zinc-400 sm:text-base">
			Paste any video URL below to extract formats and stream directly without limits.
		</p>
	</div>

	<!-- Input Form -->
	<form onsubmit={handleSubmit} class="flex flex-col gap-3 sm:flex-row">
		<input
			type="url"
			bind:value={url}
			placeholder="Paste YouTube video link here..."
			required
			class="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 text-zinc-100 placeholder-zinc-500 transition focus:border-red-500 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={loading}
			class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-medium text-white transition hover:bg-red-500 active:bg-red-700 disabled:opacity-50"
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
				<span>Analyzing...</span>
			{:else}
				<span>Fetch Video</span>
			{/if}
		</button>
	</form>

	<!-- Error Alert -->
	{#if errorMsg}
		<div
			class="rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-center text-sm text-red-400"
		>
			{errorMsg}
		</div>
	{/if}

	<!-- Results Card -->
	{#if videoData}
		<div
			class="space-y-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
		>
			<div class="flex flex-col items-start gap-4 sm:flex-row">
				<img
					src={videoData.thumbnail}
					alt={videoData.title}
					class="aspect-video w-full rounded-xl border border-zinc-800 object-cover sm:w-48"
				/>
				<div class="flex-1 space-y-1.5">
					<h2 class="line-clamp-2 text-lg font-bold">{videoData.title}</h2>
					<p class="text-xs text-zinc-400">By {videoData.uploader}</p>
				</div>
			</div>

			<!-- Format List -->
			<div class="space-y-3 border-t border-zinc-800 pt-4">
				<h3 class="text-sm font-semibold text-zinc-300">Available Formats</h3>
				<div class="space-y-2">
					{#each videoData.formats as fmt}
						<div
							class="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-3 text-sm"
						>
							<div class="flex items-center gap-3">
								<span
									class="rounded px-2 py-0.5 text-xs font-bold uppercase {fmt.type === 'audio'
										? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
										: 'border border-blue-500/20 bg-blue-500/10 text-blue-400'}"
								>
									{fmt.resolution}
								</span>
								<span class="text-xs text-zinc-400">{fmt.ext} • {fmt.filesize}</span>
							</div>

							<a
								href="/api/download?url={encodeURIComponent(url)}&format={fmt.format_id}"
								download
								class="rounded-lg bg-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-100 transition hover:bg-zinc-700"
							>
								Download
							</a>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
