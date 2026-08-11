<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuDownload, LuLoader, LuCheck, LuClock } from 'svelte-icons-pack/lu';

	let { track, index, isDownloading = false, isComplete = false, onDownload = () => {} } = $props();

	let formattedIndex = $derived((index + 1).toString().padStart(2, '0'));
</script>

<div
	class="glass-card group flex items-center justify-between gap-4 rounded-2xl p-3 transition-all duration-300 hover:border-white/20 hover:bg-white/5 sm:p-4"
>
	<div class="flex items-center gap-3.5 overflow-hidden">
		<!-- Index Number -->
		<span class="w-6 shrink-0 text-center font-mono text-xs font-extrabold text-cyan-400">
			{formattedIndex}
		</span>

		<!-- Optional Track Thumbnail -->
		{#if track.thumbnail}
			<div
				class="relative aspect-video w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 shadow-sm sm:w-16"
			>
				<img src={track.thumbnail} alt={track.title} class="h-full w-full object-cover" />
			</div>
		{/if}

		<!-- Track Information -->
		<div class="space-y-0.5 truncate">
			<h3 class="truncate text-sm font-bold text-white transition-colors group-hover:text-cyan-300">
				{track.title}
			</h3>
			<p class="flex items-center gap-1.5 text-xs text-slate-400">
				<span class="truncate">{track.uploader || 'YouTube'}</span>
				<span>•</span>
				<span class="inline-flex items-center gap-1 font-mono text-[11px]">
					{#if LuClock}
						<Icon src={LuClock} className="w-3 h-3 text-slate-500" />
					{/if}
					{track.duration || 'N/A'}
				</span>
			</p>
		</div>
	</div>

	<!-- Download Action -->
	<button
		type="button"
		onclick={onDownload}
		disabled={isDownloading}
		class="glass-button flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-sky-500/20 active:scale-95 disabled:opacity-50"
	>
		{#if isDownloading}
			{#if LuLoader}
				<Icon src={LuLoader} className="w-3.5 h-3.5 animate-spin text-cyan-400" />
			{/if}
			<span>Downloading...</span>
		{:else if isComplete}
			{#if LuCheck}
				<Icon src={LuCheck} className="w-3.5 h-3.5 text-emerald-400" />
			{/if}
			<span>Done</span>
		{:else}
			{#if LuDownload}
				<Icon src={LuDownload} className="w-3.5 h-3.5 text-cyan-400" />
			{/if}
			<span>Download</span>
		{/if}
	</button>
</div>
