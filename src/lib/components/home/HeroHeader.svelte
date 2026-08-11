<script>
	import { Icon } from 'svelte-icons-pack';
	import { LuSparkles, LuShieldCheck, LuZap, LuLock } from 'svelte-icons-pack/lu';
</script>

<div class="space-y-4 text-center">
	<div class="flex justify-center">
		<span
			class="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md"
		>
			{#if LuSparkles}
				<Icon src={LuSparkles} className="w-3.5 h-3.5 text-cyan-300" />
			{/if}
			<span>Next-Gen Media Engine</span>
		</span>
	</div>

	<h1 class="text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-tight">
		Instant High-Bitrate <br class="hidden sm:inline" />
		<span
			class="bg-linear-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent"
		>
			Video & Audio Extractor
		</span>
	</h1>

	<p class="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
		Paste any YouTube or YouTube Music link to download pristine 4K MP4 video streams or
		high-bitrate 320kbps MP3 audio instantly with real-time feedback.
	</p>

	<!-- Trust Badges -->
	<div
		class="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-slate-400"
	>
		<span class="flex items-center gap-1.5">
			{#if LuShieldCheck}
				<Icon src={LuShieldCheck} className="w-4 h-4 text-emerald-400" />
			{/if}
			No Ads or Trackers
		</span>
		<span class="flex items-center gap-1.5">
			{#if LuZap}
				<Icon src={LuZap} className="w-4 h-4 text-cyan-400" />
			{/if}
			Real-Time SSE Streaming
		</span>
		<span class="flex items-center gap-1.5">
			{#if LuLock}
				<Icon src={LuLock} className="w-4 h-4 text-blue-400" />
			{/if}
			Zero Data Storage
		</span>
	</div>
</div>
