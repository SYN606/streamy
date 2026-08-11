<script>
	import FormatSelector from './FormatSelector.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { LuDownload, LuUser, LuClock } from 'svelte-icons-pack/lu';

	let { video = null, originalUrl = '' } = $props();

	// Default state for format selection
	let selectedFormat = $state('');

	// Keep selectedFormat synchronized when video prop changes
	$effect(() => {
		if (video?.formats?.length) {
			selectedFormat = video.formats[0].format_id;
		}
	});

	// Derive currently chosen format object for label preview
	let currentFormatObj = $derived(video?.formats?.find((f) => f.format_id === selectedFormat));

	function saveToHistory() {
		if (!video || typeof window === 'undefined') return;

		try {
			const rawHistory = localStorage.getItem('streamy_history');
			const existing = rawHistory ? JSON.parse(rawHistory) : [];

			const newItem = {
				id: `${video.id}_${Date.now()}`,
				title: video.title,
				thumbnail: video.thumbnail,
				url: originalUrl,
				formatId: selectedFormat,
				format: currentFormatObj?.resolution || 'HD',
				timestamp: new Date().toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			};

			const updated = [newItem, ...existing.filter((i) => i.id !== newItem.id)].slice(0, 30);
			localStorage.setItem('streamy_history', JSON.stringify(updated));
		} catch (err) {
			console.error('[History Save Error]:', err);
		}
	}
</script>

{#if video}
	<div class="glass-panel space-y-6 rounded-3xl p-6 shadow-2xl backdrop-blur-xl sm:p-8">
		<!-- Video Header -->
		<div class="flex flex-col items-start gap-5 sm:flex-row">
			<!-- Thumbnail Preview -->
			<div
				class="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-white/15 shadow-lg sm:w-60"
			>
				<img
					src={video.thumbnail}
					alt={video.title}
					class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
				/>
				<span
					class="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-md border border-white/15 bg-black/75 px-2 py-0.5 font-mono text-xs font-medium text-white backdrop-blur-md"
				>
					{#if LuClock}
						<Icon src={LuClock} className="w-3 h-3 text-slate-300" />
					{/if}
					{video.duration}
				</span>
			</div>

			<!-- Video Metadata Info -->
			<div class="flex-1 space-y-2.5">
				<h2 class="text-lg leading-snug font-bold tracking-tight text-white sm:text-xl">
					{video.title}
				</h2>

				<div class="flex items-center gap-2 text-sm text-slate-300">
					{#if LuUser}
						<Icon src={LuUser} className="w-4 h-4 text-cyan-400" />
					{/if}
					<span>Channel:</span>
					<span class="font-medium text-white">{video.uploader}</span>
				</div>

				{#if currentFormatObj}
					<div class="pt-1">
						<span
							class="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300"
						>
							Selected: {currentFormatObj.resolution} ({currentFormatObj.ext.toUpperCase()})
						</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Format Selector Sub-component -->
		<FormatSelector formats={video.formats} bind:selectedFormat />

		<!-- Download Action Button -->
		<div class="pt-2">
			<a
				href="/api/download?url={encodeURIComponent(originalUrl)}&format={selectedFormat}"
				download
				onclick={saveToHistory}
				class="glass-button group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold tracking-wide text-white transition-all hover:bg-sky-500/20 hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.99]"
			>
				{#if LuDownload}
					<Icon
						src={LuDownload}
						className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-y-0.5"
					/>
				{:else}
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
				{/if}
				<span>Download Selected Format</span>
			</a>
		</div>
	</div>
{/if}
