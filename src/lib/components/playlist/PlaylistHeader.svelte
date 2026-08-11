<!-- src/lib/components/playlist/PlaylistHeader.svelte -->
<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuUser, LuListOrdered, LuCloudDownload } from 'svelte-icons-pack/lu';

	let {
		title = 'YouTube Playlist',
		uploader = 'Various Artists',
		trackCount = 0,
		selectedFormat = $bindable('mp3-320'),
		onDownloadAll = null
	} = $props();
</script>

<div
	class="glass-panel-glow flex flex-col gap-5 rounded-3xl p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8"
>
	<!-- Playlist Details -->
	<div class="space-y-2">
		<h2 class="text-xl leading-tight font-extrabold tracking-tight text-white sm:text-2xl">
			{title}
		</h2>

		<div class="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300">
			<span
				class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200"
			>
				{#if LuUser}
					<Icon src={LuUser} className="w-3.5 h-3.5 text-cyan-400" />
				{/if}
				{uploader}
			</span>

			<span
				class="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 font-semibold text-cyan-300"
			>
				{#if LuListOrdered}
					<Icon src={LuListOrdered} className="w-3.5 h-3.5 text-cyan-400" />
				{/if}
				{trackCount} Tracks
			</span>
		</div>
	</div>

	<!-- Actions & Format Selection -->
	<div class="flex flex-wrap items-center gap-3">
		<div class="relative flex-1 sm:flex-none">
			<select
				bind:value={selectedFormat}
				class="glass-input w-full appearance-none rounded-xl border border-white/15 bg-slate-950/90 px-4 py-2.5 text-xs font-semibold text-slate-100 shadow-inner focus:border-cyan-400 focus:outline-none sm:w-auto"
			>
				<option value="mp3-320">Audio — MP3 (320 kbps HQ)</option>
				<option value="mp3-128">Audio — MP3 (128 kbps Standard)</option>
				<option value="mp4-1080">Video — MP4 (HD Quality)</option>
				<option value="mp4-compact">Video — MP4 (Compact Size)</option>
			</select>
		</div>

		{#if onDownloadAll}
			<button
				type="button"
				onclick={onDownloadAll}
				class="glass-button flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/20 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-cyan-500/30 active:scale-95"
			>
				{#if LuCloudDownload}
					<Icon src={LuCloudDownload} className="w-4 h-4 text-cyan-300" />
				{/if}
				<span>Download All</span>
			</button>
		{/if}
	</div>
</div>
