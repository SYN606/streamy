<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuSearch, LuLoader } from 'svelte-icons-pack/lu';

	let { playlistUrl = $bindable(''), loading = false, isDownloading = false, onFetch } = $props();
</script>

<form
	onsubmit={onFetch}
	class="glass-panel-glow flex flex-col gap-2.5 rounded-2xl p-2 sm:flex-row sm:p-3"
>
	<div class="relative flex-1">
		<input
			type="url"
			bind:value={playlistUrl}
			placeholder="Paste YouTube playlist link here..."
			required
			disabled={loading || isDownloading}
			class="glass-input w-full rounded-xl px-4 py-3.5 text-sm placeholder-slate-400 focus:outline-none sm:text-base"
		/>
	</div>
	<button
		type="submit"
		disabled={loading || isDownloading || !playlistUrl.trim()}
		class="glass-button flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition disabled:opacity-50"
	>
		{#if loading}
			{#if LuLoader}
				<Icon src={LuLoader} className="h-5 w-5 animate-spin text-white" />
			{/if}
			<span>Parsing...</span>
		{:else}
			{#if LuSearch}
				<Icon src={LuSearch} className="h-4 w-4" />
			{/if}
			<span>Fetch Playlist</span>
		{/if}
	</button>
</form>
