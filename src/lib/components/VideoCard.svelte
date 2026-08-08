<script>
	import FormatSelector from './FormatSelector.svelte';

	let { video = null, originalUrl = '' } = $props();

	// svelte-ignore state_referenced_locally
	let selectedFormat = $state(video?.formats?.[0]?.format_id || 'best');

	function saveToHistory() {
		if (!video) return;

		const existing = JSON.parse(localStorage.getItem('streamy_history') || '[]');
		const fmtObj = video.formats.find((f) => f.format_id === selectedFormat);

		const newItem = {
			id: `${video.id}_${Date.now()}`,
			title: video.title,
			thumbnail: video.thumbnail,
			url: originalUrl,
			formatId: selectedFormat,
			format: fmtObj?.resolution || 'HD',
			timestamp: new Date().toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		};

		const updated = [newItem, ...existing.filter((i) => i.id !== newItem.id)].slice(0, 30);
		localStorage.setItem('streamy_history', JSON.stringify(updated));
	}
</script>

{#if video}
	<div class="glass-panel space-y-6 rounded-3xl p-6 shadow-2xl sm:p-8">
		<!-- Video Header -->
		<div class="flex flex-col items-start gap-5 sm:flex-row">
			<div
				class="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-white/15 shadow-lg sm:w-60"
			>
				<img src={video.thumbnail} alt={video.title} class="h-full w-full object-cover" />
				<span
					class="absolute right-2.5 bottom-2.5 rounded-md border border-white/15 bg-black/70 px-2 py-0.5 font-mono text-xs font-medium text-white backdrop-blur-md"
				>
					{video.duration}
				</span>
			</div>

			<div class="flex-1 space-y-2">
				<h2 class="text-lg leading-snug font-bold tracking-tight text-white sm:text-xl">
					{video.title}
				</h2>
				<p class="text-sm text-slate-300">
					Channel: <span class="font-medium text-white">{video.uploader}</span>
				</p>
			</div>
		</div>

		<!-- Format Selector -->
		<FormatSelector formats={video.formats} bind:selectedFormat />

		<!-- Download Action Button -->
		<div class="pt-2">
			<a
				href="/api/download?url={encodeURIComponent(originalUrl)}&format={selectedFormat}"
				download
				onclick={saveToHistory}
				class="glass-button flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold tracking-wide text-white transition"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				<span>Download Selected Format</span>
			</a>
		</div>
	</div>
{/if}
