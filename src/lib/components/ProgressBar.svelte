<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuLoader, LuCheck } from 'svelte-icons-pack/lu';

	// Svelte 5 Runes Props
	let { progress = 0, isDownloading = false, label = 'Downloading stream...' } = $props();

	// Derived states
	let boundedProgress = $derived(Math.min(100, Math.max(0, progress)));
	let isComplete = $derived(boundedProgress >= 100);
	let formattedPercent = $derived(boundedProgress.toFixed(1));
</script>

{#if isDownloading || isComplete}
	<div
		class="glass-panel-glow space-y-3 rounded-2xl p-4 transition-all duration-300 sm:p-5"
		role="progressbar"
		aria-valuenow={boundedProgress}
		aria-valuemin="0"
		aria-valuemax="100"
		aria-label={label}
	>
		<!-- Progress Header Info -->
		<div class="flex items-center justify-between text-xs font-semibold">
			<span class="flex items-center gap-2 text-slate-200">
				{#if isComplete}
					{#if LuCheck}
						<Icon src={LuCheck} className="w-4 h-4 text-emerald-400" />
					{/if}
				{:else if LuLoader}
					<Icon src={LuLoader} className="w-4 h-4 animate-spin text-cyan-400" />
				{/if}
				<span class="tracking-wide">
					{isComplete ? 'Download Complete!' : label}
				</span>
			</span>

			<span class="font-mono text-sm font-bold text-cyan-400">
				{formattedPercent}%
			</span>
		</div>

		<!-- Progress Track -->
		<div
			class="h-2.5 w-full overflow-hidden rounded-full border border-slate-700/50 bg-slate-950/80 p-0.5 shadow-inner"
		>
			<div
				class="h-full rounded-full transition-all duration-200 ease-out {isComplete
					? 'bg-linear-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
					: 'animate-pulse bg-linear-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]'}"
				style="width: {boundedProgress}%;"
			></div>
		</div>
	</div>
{/if}
