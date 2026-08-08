<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuLoader, LuCheck } from 'svelte-icons-pack/lu';

	let { progress = 0, isDownloading = false, label = 'Downloading stream...' } = $props();

	let isComplete = $derived(progress >= 100);
</script>

{#if isDownloading || isComplete}
	<div class="glass-panel-glow space-y-3 rounded-2xl p-4 transition-all duration-300 sm:p-5">
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
				<span>{isComplete ? 'Download Complete!' : label}</span>
			</span>

			<span class="font-mono text-sm font-bold text-cyan-accent">
				{progress.toFixed(1)}%
			</span>
		</div>

		<!-- Progress Track -->
		<div
			class="h-2.5 w-full overflow-hidden rounded-full border border-glass-border bg-slate-950/80 p-0.5 shadow-inner"
		>
			<div
				class="h-full rounded-full bg-linear-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all duration-200 ease-out"
				style="width: {Math.min(100, Math.max(0, progress))}%;"
			></div>
		</div>
	</div>
{/if}
