<script>
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { LuSearch, LuX, LuClipboard, LuTriangleAlert, LuCircleCheck } from 'svelte-icons-pack/lu';

	let {
		mediaUrl = $bindable(''),
		loading = false,
		isDownloading = false,
		downloadComplete = false,
		errorMsg = $bindable(''),
		progress = 0,
		onSubmit,
		onClear
	} = $props();

	async function handlePaste() {
		try {
			const text = await navigator.clipboard.readText();
			if (text) {
				mediaUrl = text;
				errorMsg = '';
			}
		} catch (err) {
			console.warn('Clipboard read permission denied:', err);
		}
	}
</script>

<div class="space-y-4">
	<form
		onsubmit={onSubmit}
		class="glass-panel relative flex items-center rounded-2xl p-2 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-cyan-500/50"
	>
		<div class="relative flex flex-1 items-center">
			<input
				type="url"
				bind:value={mediaUrl}
				placeholder="Paste video or track link (e.g., https://youtu.be/...)"
				required
				disabled={loading || isDownloading}
				class="w-full bg-transparent px-4 py-3 pr-16 text-sm text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
			/>

			<div class="absolute right-2 flex items-center gap-1">
				{#if mediaUrl}
					<button
						type="button"
						onclick={onClear}
						disabled={loading || isDownloading}
						class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
						title="Clear input"
						aria-label="Clear input"
					>
						{#if LuX}
							<Icon src={LuX} className="w-4 h-4" />
						{/if}
					</button>
				{:else}
					<button
						type="button"
						onclick={handlePaste}
						disabled={loading || isDownloading}
						class="flex cursor-pointer items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/15 hover:text-white disabled:opacity-50"
						title="Paste link from clipboard"
						aria-label="Paste link from clipboard"
					>
						{#if LuClipboard}
							<Icon src={LuClipboard} className="w-3.5 h-3.5" />
						{/if}
						<span class="hidden sm:inline">Paste</span>
					</button>
				{/if}
			</div>
		</div>

		<button
			type="submit"
			disabled={loading || isDownloading || !mediaUrl.trim()}
			class="glass-button flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white transition disabled:opacity-50"
		>
			{#if loading}
				<span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
				></span>
				<span>Analyzing...</span>
			{:else}
				{#if LuSearch}
					<Icon src={LuSearch} className="w-4 h-4" />
				{/if}
				<span>Extract Stream</span>
			{/if}
		</button>
	</form>

	<!-- Error Banner -->
	{#if errorMsg}
		<div
			class="glass-card flex items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-sm font-medium text-red-200 shadow-xl"
		>
			<div class="flex items-center gap-2.5">
				{#if LuTriangleAlert}
					<Icon src={LuTriangleAlert} className="w-5 h-5 shrink-0 text-red-400" />
				{/if}
				<span>{errorMsg}</span>
			</div>
			<button
				type="button"
				onclick={() => (errorMsg = '')}
				class="rounded-lg p-1 text-red-300 transition hover:bg-red-900/50 hover:text-white"
				aria-label="Dismiss error"
			>
				{#if LuX}
					<Icon src={LuX} className="w-4 h-4" />
				{/if}
			</button>
		</div>
	{/if}

	<!-- Completion Notification -->
	{#if downloadComplete && !isDownloading}
		<div
			class="glass-card flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm font-medium text-emerald-200 shadow-xl"
		>
			{#if LuCircleCheck}
				<Icon src={LuCircleCheck} className="w-5 h-5 shrink-0 text-emerald-400" />
			{/if}
			<span>Download initiated! Check your browser's default downloads location.</span>
		</div>
	{/if}

	<!-- Active Real-Time Progress -->
	{#if isDownloading}
		<ProgressBar {progress} {isDownloading} label="Transcoding & Streaming Media File..." />
	{/if}
</div>
