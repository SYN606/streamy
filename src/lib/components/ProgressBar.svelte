<script>
	let { progress = 0, isDownloading = false, label = 'Downloading stream...' } = $props();
</script>

{#if isDownloading}
	<div
		class="glass-card animate-fade-in space-y-2 rounded-2xl border border-white/15 p-4 shadow-xl"
	>
		<div class="flex items-center justify-between text-xs font-semibold">
			<span class="flex items-center gap-2 text-slate-300">
				<span class="h-2 w-2 animate-ping rounded-full bg-sky-400"></span>
				{label}
			</span>
			<span class="font-mono text-sm font-bold text-sky-400">{progress.toFixed(1)}%</span>
		</div>

		<!-- Progress Outer Track -->
		<div
			class="h-2.5 w-full overflow-hidden rounded-full border border-white/10 bg-slate-900/80 p-0.5"
		>
			<!-- Animated Glass Fill -->
			<div
				class="h-full rounded-full bg-linear-to-r from-sky-500 to-blue-500 shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-200 ease-out"
				style="width: {progress}%;"
			></div>
		</div>
	</div>
{/if}
