<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuDownload } from 'svelte-icons-pack/lu';

	let { track, index, isDownloading = false, onDownload } = $props();
</script>

<div class="glass-card flex items-center justify-between gap-4 rounded-xl p-3.5 sm:p-4">
	<div class="flex items-center gap-3.5 overflow-hidden">
		<span class="w-6 shrink-0 text-center font-mono text-xs font-extrabold text-cyan-accent">
			{(index + 1).toString().padStart(2, '0')}
		</span>
		<div class="space-y-0.5 truncate">
			<h3 class="truncate text-sm font-bold text-white">{track.title}</h3>
			<p class="text-xs text-slate-400">
				{track.uploader || 'YouTube'} • {track.duration || 'N/A'}
			</p>
		</div>
	</div>

	<button
		onclick={onDownload}
		disabled={isDownloading}
		class="glass-button flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
	>
		<Icon src={LuDownload} className="w-3.5 h-3.5" />
		<span>Download</span>
	</button>
</div>
