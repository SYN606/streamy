<script>
	let { formats = [], selectedFormat = $bindable(''), onSelect = () => {} } = $props();

	let filter = $state('all');

	let filteredFormats = $derived(
		formats.filter((f) => {
			if (filter === 'video') return f.type === 'video';
			if (filter === 'audio') return f.type === 'audio';
			return true;
		})
	);
</script>

<div class="space-y-4">
	<!-- Filter Header Tabs -->
	<div class="flex items-center justify-between border-b border-white/10 pb-3">
		<h3 class="text-xs font-semibold tracking-wider text-slate-300 uppercase">Available Formats</h3>
		<div
			class="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/60 p-1 backdrop-blur-md"
		>
			{#each ['all', 'video', 'audio'] as mode}
				<button
					type="button"
					onclick={() => (filter = mode)}
					class="cursor-pointer rounded-lg px-3 py-1 text-xs font-medium capitalize transition {filter ===
					mode
						? 'border border-white/20 bg-white/15 text-white shadow-sm'
						: 'text-slate-400 hover:text-white'}"
				>
					{mode}
				</button>
			{/each}
		</div>
	</div>

	<!-- Formats List -->
	<div class="max-h-64 space-y-2.5 overflow-y-auto pr-1">
		{#each filteredFormats as fmt (fmt.format_id)}
			<label
				class="glass-card flex cursor-pointer items-center justify-between rounded-xl p-3.5 transition-all {selectedFormat ===
				fmt.format_id
					? 'border-sky-400/60 bg-sky-500/10 shadow-md shadow-sky-500/10'
					: 'hover:bg-white/5'}"
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
						<span class="text-sm font-semibold text-slate-100">{fmt.ext.toUpperCase()}</span>
					</div>
				</div>

				<span class="font-mono text-xs text-slate-300">{fmt.filesize}</span>
			</label>
		{/each}
	</div>
</div>
