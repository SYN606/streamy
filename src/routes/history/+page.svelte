<script>
	import { onMount } from 'svelte';

	let history = $state([]);

	onMount(() => {
		const saved = localStorage.getItem('streamy_history');
		if (saved) {
			try {
				history = JSON.parse(saved);
			} catch (e) {
				console.error('Failed to parse download history', e);
			}
		}
	});

	function clearHistory() {
		localStorage.removeItem('streamy_history');
		history = [];
	}

	function removeItem(id) {
		history = history.filter((item) => item.id !== id);
		localStorage.setItem('streamy_history', JSON.stringify(history));
	}
</script>

<div class="mx-auto max-w-3xl space-y-6 py-4">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Download History</h1>
			<p class="text-xs text-slate-400 sm:text-sm">Stored locally on your browser.</p>
		</div>

		{#if history.length > 0}
			<button
				onclick={clearHistory}
				class="cursor-pointer rounded-xl border border-red-500/20 bg-red-950/40 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-900/50"
			>
				Clear History
			</button>
		{/if}
	</div>

	<!-- History List -->
	{#if history.length === 0}
		<div class="glass-panel space-y-3 rounded-3xl p-12 text-center">
			<div
				class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-lg text-sky-400"
			>
				📜
			</div>
			<h3 class="text-base font-semibold text-white">No Download History Yet</h3>
			<p class="mx-auto max-w-sm text-xs text-slate-400">
				Media downloads will automatically show up here for easy access later.
			</p>
			<a
				href="/"
				class="glass-button mt-2 inline-block cursor-pointer rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
			>
				Start Downloading
			</a>
		</div>
	{:else}
		<div class="space-y-3">
			{#each history as item (item.id)}
				<div
					class="glass-card flex flex-col items-start justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-3">
						<img
							src={item.thumbnail}
							alt={item.title}
							class="h-14 w-24 shrink-0 rounded-xl border border-white/10 object-cover"
						/>
						<div class="space-y-1">
							<h4 class="line-clamp-1 text-sm font-semibold text-white">{item.title}</h4>
							<div class="flex items-center gap-2 text-[11px] text-slate-400">
								<span
									class="rounded border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 font-mono text-sky-400"
								>
									{item.format}
								</span>
								<span>•</span>
								<span>{item.timestamp}</span>
							</div>
						</div>
					</div>

					<div class="flex w-full items-center justify-end gap-2 sm:w-auto">
						<a
							href="/api/download?url={encodeURIComponent(item.url)}&format={item.formatId}"
							download
							class="glass-button cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-medium text-white"
						>
							Re-download
						</a>
						<button
							onclick={() => removeItem(item.id)}
							aria-label="Remove item"
							class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-red-400"
						>
							✕
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
