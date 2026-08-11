<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuSearch, LuLoader, LuX } from 'svelte-icons-pack/lu';

	let {
		playlistUrl = $bindable(''),
		loading = false,
		isDownloading = false,
		onFetch = () => {}
	} = $props();

	function handleSubmit(e) {
		e.preventDefault();
		if (playlistUrl.trim() && !loading && !isDownloading) {
			onFetch();
		}
	}

	function clearInput() {
		playlistUrl = '';
	}
</script>

<form
	onsubmit={handleSubmit}
	class="glass-panel-glow flex flex-col gap-3 rounded-2xl p-2.5 backdrop-blur-xl sm:flex-row sm:p-3.5"
>
	<!-- URL Input Field -->
	<div class="relative flex-1">
		<input
			type="url"
			bind:value={playlistUrl}
			placeholder="Paste YouTube playlist link here..."
			required
			disabled={loading || isDownloading}
			class="glass-input w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3.5 pr-10 text-sm text-white placeholder-slate-400 transition-all focus:border-cyan-400 focus:bg-slate-950/80 focus:outline-none disabled:opacity-50 sm:text-base"
		/>

		{#if playlistUrl && !loading}
			<button
				type="button"
				onclick={clearInput}
				class="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-slate-400 transition-colors hover:text-white"
				aria-label="Clear input"
			>
				{#if LuX}
					<Icon src={LuX} className="w-4 h-4" />
				{/if}
			</button>
		{/if}
	</div>

	<!-- Fetch Submit Button -->
	<button
		type="submit"
		disabled={loading || isDownloading || !playlistUrl.trim()}
		class="glass-button flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500/20 to-blue-500/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:from-cyan-500/30 hover:to-blue-500/30 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
	>
		{#if loading}
			{#if LuLoader}
				<Icon src={LuLoader} className="h-5 w-5 animate-spin text-cyan-400" />
			{/if}
			<span>Parsing Tracks...</span>
		{:else}
			{#if LuSearch}
				<Icon src={LuSearch} className="h-4 w-4 text-cyan-400" />
			{/if}
			<span>Fetch Playlist</span>
		{/if}
	</button>
</form>
