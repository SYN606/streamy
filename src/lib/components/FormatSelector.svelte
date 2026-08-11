<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuFilm, LuMusic, LuListFilter } from 'svelte-icons-pack/lu';

	let { formats = [], selectedFormat = $bindable(''), onSelect = () => {} } = $props();

	let filter = $state('all');

	// Filter formats by selected tab
	let filteredFormats = $derived(
		formats.filter((f) => {
			if (filter === 'video') return f.type === 'video';
			if (filter === 'audio') return f.type === 'audio';
			return true;
		})
	);

	// Svelte 5 effect: auto-select top item if current selection isn't in filtered list
	$effect(() => {
		if (
			filteredFormats.length > 0 &&
			!filteredFormats.some((f) => f.format_id === selectedFormat)
		) {
			selectedFormat = filteredFormats[0].format_id;
			onSelect(filteredFormats[0]);
		}
	});
</script>

<div class="space-y-4">
	<!-- Filter Header Tabs -->
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
		<h3 class="text-xs font-semibold tracking-wider text-slate-300 uppercase">Available Formats</h3>

		<!-- Filter Mode Selector -->
		<div
			class="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1 backdrop-blur-md"
		>
			{#each ['all', 'video', 'audio'] as mode}
				<button
					type="button"
					onclick={() => (filter = mode)}
					class="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium capitalize transition-all {filter ===
					mode
						? 'border border-sky-400/30 bg-sky-500/20 text-white shadow-sm'
						: 'text-slate-400 hover:bg-white/5 hover:text-white'}"
				>
					{#if mode === 'video' && LuFilm}
						<Icon src={LuFilm} className="w-3 h-3" />
					{:else if mode === 'audio' && LuMusic}
						<Icon src={LuMusic} className="w-3 h-3" />
					{:else if mode === 'all' && LuListFilter}
						<Icon src={LuListFilter} className="w-3 h-3" />
					{/if}
					<span>{mode}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Formats List -->
	{#if filteredFormats.length > 0}
		<div
			class="max-h-64 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent space-y-2.5 overflow-y-auto pr-1.5"
		>
			{#each filteredFormats as fmt (fmt.format_id)}
				<label
					class="glass-card flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all {selectedFormat ===
					fmt.format_id
						? 'border-sky-400/60 bg-sky-500/15 shadow-md shadow-sky-500/10'
						: 'border-white/10 hover:border-white/20 hover:bg-white/5'}"
				>
					<div class="flex items-center gap-3.5">
						<input
							type="radio"
							name="format"
							value={fmt.format_id}
							bind:group={selectedFormat}
							onchange={() => onSelect(fmt)}
							class="h-4 w-4 accent-sky-400"
						/>

						<div class="flex items-center gap-2.5">
							<span
								class="rounded-lg px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase {fmt.type ===
								'audio'
									? 'border border-amber-400/20 bg-amber-400/10 text-amber-300'
									: 'border border-sky-400/20 bg-sky-400/10 text-sky-300'}"
							>
								{fmt.resolution}
							</span>

							<span class="text-sm font-semibold text-slate-100">
								{fmt.ext.toUpperCase()}
							</span>

							{#if fmt.isTranscode}
								<span
									class="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-400"
								>
									MP3 Tagged
								</span>
							{/if}
						</div>
					</div>

					<span class="font-mono text-xs text-slate-300">
						{fmt.filesize}
					</span>
				</label>
			{/each}
		</div>
	{:else}
		<div
			class="rounded-xl border border-white/10 bg-slate-900/40 py-8 text-center text-xs text-slate-400"
		>
			No formats found for the selected filter.
		</div>
	{/if}
</div>
