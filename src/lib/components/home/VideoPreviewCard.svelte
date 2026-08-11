<script>
	import FormatSelector from '$lib/components/FormatSelector.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { LuDownload } from 'svelte-icons-pack/lu';

	let {
		video = null,
		selectedFormat = $bindable('mp3-320'),
		mediaUrl = '',
		onDownload,
		resultContainer = $bindable(null)
	} = $props();
</script>

{#if video}
	<div bind:this={resultContainer} class="glass-panel space-y-6 rounded-3xl p-6 shadow-2xl sm:p-8">
		<div class="flex flex-col items-start gap-5 sm:flex-row">
			<div
				class="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-lg sm:w-64"
			>
				<img src={video.thumbnail} alt={video.title} class="h-full w-full object-cover" />
				{#if video.duration && video.duration !== 'N/A'}
					<span
						class="absolute right-2.5 bottom-2.5 rounded-md border border-white/15 bg-black/80 px-2 py-0.5 font-mono text-xs font-medium text-white backdrop-blur-md"
					>
						{video.duration}
					</span>
				{/if}
			</div>

			<div class="flex-1 space-y-2">
				<h2 class="text-lg leading-snug font-bold tracking-tight text-white sm:text-xl">
					{video.title}
				</h2>
				<p class="flex items-center gap-1.5 text-sm text-slate-300">
					<span class="text-slate-400">Channel / Uploader:</span>
					<span class="font-medium text-white">{video.artist || 'Unknown Creator'}</span>
				</p>
				{#if video.album && video.album !== 'Single'}
					<p class="text-xs text-slate-400">
						Source Album: <span class="text-slate-200">{video.album}</span>
					</p>
				{/if}
			</div>
		</div>

		<!-- Format Selector -->
		{#if video.formats && video.formats.length > 0}
			<div class="space-y-3 pt-2">
				<label
					for="format-select-label"
					id="format-select-label"
					class="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
				>
					Target Output Quality & Format
				</label>
				<FormatSelector formats={video.formats} bind:selectedFormat />
			</div>
		{/if}

		<!-- Download Action -->
		<div class="pt-2">
			<button
				type="button"
				onclick={onDownload}
				class="glass-button flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold tracking-wide text-white transition active:scale-[0.99]"
			>
				{#if LuDownload}
					<Icon src={LuDownload} className="w-4 h-4" />
				{/if}
				<span>Download Media Package</span>
			</button>
		</div>
	</div>
{/if}
