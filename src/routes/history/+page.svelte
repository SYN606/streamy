<script>
	// Reactive state for download history
	let history = $state([
		{
			id: '1',
			title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
			duration: 'LIVE',
			format: 'MP3 (320kbps)',
			date: 'Just now',
			thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg',
			url: 'https://youtube.com/watch?v=jfKfPfyJRdk'
		},
		{
			id: '2',
			title: 'SvelteKit 2.0 Full Course - Build Modern Web Apps',
			duration: '42:15',
			format: 'MP4 (1080p)',
			date: '2 hours ago',
			thumbnail: 'https://img.youtube.com/vi/H1eEwf1_l58/hqdefault.jpg',
			url: 'https://youtube.com/watch?v=H1eEwf1_l58'
		}
	]);

	function clearHistory() {
		history = [];
	}

	function removeItem(id) {
		history = history.filter((item) => item.id !== id);
	}
</script>

<div class="mx-auto max-w-3xl space-y-8 py-4">
	<!-- Header & Actions -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1">
			<span
				class="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400 backdrop-blur-md"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
				Local History
			</span>
			<h1 class="text-3xl font-extrabold tracking-tight text-white">Recent Downloads</h1>
		</div>

		{#if history.length > 0}
			<button
				onclick={clearHistory}
				class="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-300 sm:self-auto"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
				Clear All History
			</button>
		{/if}
	</div>

	<!-- History Items List -->
	{#if history.length > 0}
		<div class="space-y-3">
			{#each history as item (item.id)}
				<div
					class="glass-card flex flex-col gap-4 rounded-2xl p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between"
				>
					<!-- Thumbnail & Metadata -->
					<div class="flex items-center gap-4">
						<div
							class="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-inner"
						>
							<img src={item.thumbnail} alt={item.title} class="h-full w-full object-cover" />
							<span
								class="absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-xs"
							>
								{item.duration}
							</span>
						</div>

						<div class="space-y-1">
							<a
								href={item.url}
								target="_blank"
								rel="noreferrer"
								class="line-clamp-1 text-sm font-bold text-white transition hover:text-sky-300"
							>
								{item.title}
							</a>
							<div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
								<span
									class="rounded-md border border-sky-400/20 bg-sky-500/10 px-2 py-0.5 font-mono text-sky-300"
								>
									{item.format}
								</span>
								<span>•</span>
								<span>{item.date}</span>
							</div>
						</div>
					</div>

					<!-- Item Actions -->
					<div
						class="flex items-center justify-end gap-2 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0"
					>
						<a
							href={item.url}
							target="_blank"
							rel="noreferrer"
							class="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/20 hover:text-white"
						>
							Re-open
						</a>
						<button
							onclick={() => removeItem(item.id)}
							class="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-300"
							aria-label="Remove item"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Glass Empty State -->
		<div
			class="glass-panel flex flex-col items-center justify-center rounded-3xl p-10 text-center shadow-2xl"
		>
			<div
				class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl text-slate-400 shadow-inner"
			>
				📂
			</div>
			<h3 class="text-xl font-bold text-white">No Recent Downloads</h3>
			<p class="mt-2 max-w-sm text-sm text-slate-300">
				Your conversion history will appear here temporarily during your active session.
			</p>
			<a
				href="/"
				class="glass-button mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-white transition"
			>
				Convert Media Now
			</a>
		</div>
	{/if}
</div>

<ElicitationsGroup message="What would you like to update next?">
	<Elicitation
		label="Update Playlist page with glass aesthetic"
		query="Show me how to update the playlist page (src/routes/playlist/+page.svelte) to match the new iOS glass style."
	/>
</ElicitationsGroup>
