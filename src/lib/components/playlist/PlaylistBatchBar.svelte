<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuSquare, LuSquareCheck, LuDownload } from 'svelte-icons-pack/lu';

	let {
		selectedCount = 0,
		totalCount = 0,
		isDownloading = false,
		onToggleSelectAll,
		onBatchDownload
	} = $props();
</script>

<div
	class="glass-panel-glow flex flex-col items-center justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:px-6"
>
	<div class="flex items-center gap-3">
		<button
			type="button"
			onclick={onToggleSelectAll}
			class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
		>
			{#if selectedCount === totalCount && totalCount > 0}
				{#if LuSquareCheck}
					<Icon src={LuSquareCheck} className="w-4 h-4 text-cyan-400" />
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
			<strong class="text-cyan-300">{selectedCount}</strong> of {totalCount} tracks selected
		</span>
	</div>

	<button
		type="button"
		disabled={isDownloading || selectedCount === 0}
		onclick={onBatchDownload}
		class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-linear-to-r from-cyan-500/20 to-blue-600/20 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md transition hover:scale-[1.02] hover:border-cyan-400/50 active:scale-95 disabled:opacity-50 sm:w-auto"
	>
		{#if LuDownload}
			<Icon src={LuDownload} className="w-4 h-4 text-cyan-300" />
		{/if}
		<span>Download Selected ({selectedCount})</span>
	</button>
</div>
