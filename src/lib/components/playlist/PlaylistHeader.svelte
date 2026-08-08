<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuUser, LuListOrdered } from 'svelte-icons-pack/lu';

	let { title, uploader, trackCount = 0, selectedFormat = $bindable() } = $props();
</script>

<div
	class="glass-panel-glow flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between"
>
	<div class="space-y-1">
		<h2 class="text-xl font-extrabold text-white">{title}</h2>
		<p class="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
			<span class="inline-flex items-center gap-1 text-slate-300">
				<Icon src={LuUser} className="w-3.5 h-3.5 text-cyan-400" />
				{uploader}
			</span>
			<span>•</span>
			<span class="inline-flex items-center gap-1 text-cyan-accent">
				<Icon src={LuListOrdered} className="w-3.5 h-3.5 text-cyan-400" />
				{trackCount} Tracks
			</span>
		</p>
	</div>

	<!-- Format Selector -->
	<div class="flex items-center gap-2">
		<select
			bind:value={selectedFormat}
			class="glass-input rounded-xl bg-slate-950/80 px-3.5 py-2 text-xs font-semibold text-slate-100 focus:outline-none"
		>
			<option value="bestvideo+bestaudio/best">Video (MP4 HD)</option>
			<option value="bestaudio/best">Audio (MP3/M4A)</option>
		</select>
	</div>
</div>
