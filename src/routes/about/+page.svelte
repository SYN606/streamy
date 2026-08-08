<script>
	import { Icon } from 'svelte-icons-pack';
	import {
		LuInfo,
		LuZap,
		LuShieldCheck,
		LuSparkles,
		LuHelpCircle,
		LuCheckCircle2,
		LuArrowRight,
		LuDownload,
		LuLayers
	} from 'svelte-icons-pack/lu';

	const features = [
		{
			title: 'Ultra Fast Extraction',
			description:
				'Powered by yt-dlp backend with real-time SSE progress streaming for instant conversions.',
			icon: LuZap
		},
		{
			title: 'No Ads or Trackers',
			description:
				'Pure, lightweight media processing experience without intrusive popup ads or telemetry.',
			icon: LuShieldCheck
		},
		{
			title: 'Playlist & Batch Support',
			description:
				'Extract multi-track YouTube playlists seamlessly into customizable MP3 or MP4 formats.',
			icon: LuLayers
		},
		{
			title: 'High Definition Audio & Video',
			description:
				'Supports up to 4K resolution videos and highest quality 320kbps audio bitrate streams.',
			icon: LuSparkles
		}
	];

	const faqs = [
		{
			question: 'Is Streamy free to use?',
			answer:
				'Yes, Streamy is completely free and open-source. There are no download limits or premium paywalls.'
		},
		{
			question: 'Which formats are supported for download?',
			answer:
				'You can extract media in MP4 HD video format or convert directly to pristine MP3/M4A audio.'
		},
		{
			question: 'How does real-time download progress work?',
			answer:
				'Streamy leverages Server-Sent Events (SSE) to push exact download percentage and speed metrics directly to your screen in real time.'
		},
		{
			question: 'Is my search and download history stored permanently?',
			answer:
				'No. All history items are saved locally in your active browser session and can be cleared at any time.'
		}
	];
</script>

<div class="mx-auto max-w-4xl space-y-12 py-4">
	<!-- Hero Header -->
	<div class="space-y-3 text-center">
		<div class="flex justify-center">
			<span
				class="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-accent uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md"
			>
				<Icon src={LuInfo} className="w-3.5 h-3.5 text-cyan-300" />
				<span>About & FAQ</span>
			</span>
		</div>

		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
			High-Speed <span
				class="bg-linear-to-r from-cyan-accent via-sky-glow to-blue-glow bg-clip-text text-transparent"
				>Media Converter</span
			>
		</h1>
		<p class="mx-auto max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
			Streamy is a modern web application engineered for quick, seamless video and audio extraction
			with zero clutter.
		</p>
	</div>

	<!-- Feature Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{#each features as feature}
			<div class="glass-card flex flex-col gap-3 rounded-2xl p-6">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-cyan-500/10 text-cyan-300 shadow-inner"
				>
					<Icon src={feature.icon} className="w-5 h-5" />
				</div>
				<h3 class="text-base font-bold text-white">{feature.title}</h3>
				<p class="text-xs leading-relaxed text-slate-300 sm:text-sm">
					{feature.description}
				</p>
			</div>
		{/each}
	</div>

	<!-- FAQ Section -->
	<div class="glass-panel-glow space-y-6 rounded-3xl p-6 sm:p-8">
		<div class="flex items-center gap-2.5 border-b border-white/10 pb-4">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg border border-glass-border bg-cyan-500/10 text-cyan-300"
			>
				<Icon src={LuHelpCircle} className="w-4 h-4" />
			</div>
			<h2 class="text-xl font-extrabold text-white">Frequently Asked Questions</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each faqs as faq}
				<div class="glass-card space-y-2 rounded-2xl p-5">
					<h3 class="flex items-start gap-2 text-sm font-bold text-cyan-200">
						<Icon src={LuCheckCircle2} className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
						<span>{faq.question}</span>
					</h3>
					<p class="pl-6 text-xs leading-relaxed text-slate-300">
						{faq.answer}
					</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Call to Action Footer Box -->
	<div
		class="glass-panel flex flex-col items-center justify-between gap-4 rounded-3xl p-8 text-center sm:flex-row sm:text-left"
	>
		<div class="space-y-1">
			<h3 class="text-lg font-bold text-white">Ready to download your favorite media?</h3>
			<p class="text-xs text-slate-300">
				Convert videos or audio streams in seconds without registration.
			</p>
		</div>
		<a
			href="/"
			class="glass-button flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white transition"
		>
			<Icon src={LuDownload} className="w-4 h-4" />
			<span>Start Converting</span>
			<Icon src={LuArrowRight} className="w-3.5 h-3.5" />
		</a>
	</div>
</div>
