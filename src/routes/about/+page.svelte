<script>
	import { Icon } from 'svelte-icons-pack';
	import {
		LuInfo,
		LuZap,
		LuShieldCheck,
		LuSparkles,
		LuCircleHelp,
		LuCheck,
		LuArrowRight,
		LuDownload,
		LuLayers,
		LuChevronDown,
		LuCpu,
		LuHardDrive,
		LuLock,
		LuGlobe,
		LuSearch,
		LuActivity,
		LuTerminal,
		LuRadio,
		LuWorkflow
	} from 'svelte-icons-pack/lu';

	// State using Svelte 5 Runes
	let openFaq = $state(0);
	let faqQuery = $state('');
	let systemStatus = $state({
		ytdlp: 'v2026.02.01 (Latest)',
		ffmpeg: 'Ready',
		sseStream: 'Active',
		latency: '24ms'
	});

	const workflowSteps = [
		{
			step: '01',
			title: 'Paste Link',
			desc: 'Copy any single video, track, or playlist URL from YouTube or YouTube Music.'
		},
		{
			step: '02',
			title: 'Analyze Stream',
			desc: 'Our engine parses high-bitrate audio targets and video streams instantly.'
		},
		{
			step: '03',
			title: 'Format Selection',
			desc: 'Choose from pristine 4K video, 320kbps MP3s, or custom audio containers.'
		},
		{
			step: '04',
			title: 'Live Stream Download',
			desc: 'Real-time SSE progress tracks transcoding and pushes directly to your browser.'
		}
	];

	const features = [
		{
			title: 'Ultra Fast Extraction',
			description:
				'Powered by a modern, high-performance yt-dlp backend with real-time SSE progress streaming for instant conversions.',
			icon: LuZap
		},
		{
			title: 'No Ads or Trackers',
			description:
				'Enjoy a pure, distraction-free media extraction experience without intrusive popups, ad redirects, or telemetry tracking.',
			icon: LuShieldCheck
		},
		{
			title: 'Playlist & Batch Extraction',
			description:
				'Extract multi-track YouTube playlists or SoundCloud albums seamlessly into customized MP3 audio or MP4 video packages.',
			icon: LuLayers
		},
		{
			title: 'High Definition Audio & Video',
			description:
				'Preserve crisp video streams up to 4K 60fps resolution and audiophile-grade 320kbps audio bitrate tracks.',
			icon: LuSparkles
		}
	];

	const specs = [
		{
			title: 'Supported Output Formats',
			items: [
				'MP3 (320kbps, 256kbps, 128kbps)',
				'MP4 (4K, 1080p, 720p, 480p)',
				'AAC & WebM Audio/Video Streams'
			],
			icon: LuHardDrive
		},
		{
			title: 'Performance & Engine',
			items: [
				'Server-Sent Events (SSE) Live Status',
				'High-bandwidth Stream Passthrough',
				'Automated Format Transcoding'
			],
			icon: LuCpu
		},
		{
			title: 'Privacy & Security Standards',
			items: [
				'Zero Persistent Server Storage',
				'Client-side Local Session Storage',
				'Fully Open Source Architecture'
			],
			icon: LuLock
		}
	];

	const allFaqs = [
		{
			question: 'Is Streamy completely free to use?',
			answer:
				'Yes, Streamy is 100% free and open-source. There are no premium paywalls, daily conversion limits, or hidden subscriptions required.'
		},
		{
			question: 'Which formats and video resolutions are supported?',
			answer:
				'You can convert content directly to MP4 (from 360p up to pristine 4K 60fps) or extract audio directly as high-bitrate MP3s (up to 320kbps).'
		},
		{
			question: 'How does the real-time progress bar work?',
			answer:
				'Streamy utilizes Server-Sent Events (SSE) to push instant status notifications, conversion percentages, and download throughput metrics directly to your client screen in real time.'
		},
		{
			question: 'Is my search or download history saved on any server?',
			answer:
				'No. Streamy respects user privacy. Your conversion history is strictly saved inside your browser local storage (`localStorage`) and can be cleared instantly at any time.'
		},
		{
			question: 'Can I download an entire YouTube playlist at once?',
			answer:
				'Yes! Simply navigate to our Playlist Extractor, paste any public playlist URL, select your preferred quality setting, and convert all tracks in batch mode.'
		},
		{
			question: 'What happens if a video link fails to extract?',
			answer:
				'Ensure the link is public and not age-restricted or private. If issues persist, clearing your browser cache or switching format options usually resolves temporary extraction blocks.'
		}
	];

	// Filtered FAQ derived state
	let filteredFaqs = $derived(
		allFaqs.filter(
			(faq) =>
				faq.question.toLowerCase().includes(faqQuery.toLowerCase()) ||
				faq.answer.toLowerCase().includes(faqQuery.toLowerCase())
		)
	);

	function toggleFaq(index) {
		openFaq = openFaq === index ? -1 : index;
	}
</script>

<div class="mx-auto max-w-5xl space-y-16 py-8">
	<!-- Hero Header -->
	<div class="space-y-6 text-center">
		<div class="flex justify-center">
			<span
				class="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-cyan-500/10 px-5 py-2 text-xs font-semibold tracking-wider text-cyan-300 uppercase shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md"
			>
				{#if LuInfo}
					<Icon src={LuInfo} className="w-4 h-4 text-cyan-300" />
				{/if}
				<span>About Streamy & Architecture</span>
			</span>
		</div>

		<h1 class="text-4xl font-black tracking-tight text-white sm:text-6xl sm:leading-tight">
			High-Speed Next-Gen <br class="hidden sm:inline" />
			<span
				class="bg-linear-to-rrom-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent"
			>
				Media Conversion Engine
			</span>
		</h1>

		<p class="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
			Streamy is a lightweight, high-performance web suite engineered for effortless video and audio
			extraction. Experience zero ads, zero bloat, and real-time conversion feedback.
		</p>

		<div class="flex flex-wrap items-center justify-center gap-4 pt-2">
			<a
				href="/"
				class="glass-button inline-flex cursor-pointer items-center gap-2 rounded-xl px-7 py-3.5 text-xs font-bold text-white shadow-xl transition"
			>
				{#if LuDownload}
					<Icon src={LuDownload} className="w-4 h-4 text-cyan-300" />
				{/if}
				<span>Single Video Extractor</span>
			</a>
			<a
				href="/playlist"
				class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-xs font-bold text-slate-200 transition hover:bg-white/10"
			>
				{#if LuLayers}
					<Icon src={LuLayers} className="w-4 h-4 text-cyan-400" />
				{/if}
				<span>Playlist Extractor</span>
			</a>
		</div>
	</div>

	<!-- Live Engine Status Widget -->
	<div class="glass-panel rounded-3xl p-6 shadow-xl">
		<div
			class="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-2.5">
				<span class="relative flex h-3 w-3">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
					></span>
					<span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
				</span>
				<h3 class="text-sm font-bold tracking-wider text-white uppercase">
					Engine Diagnostic Status
				</h3>
			</div>
			<span class="font-mono text-xs text-slate-400">All Nodes Operational</span>
		</div>

		<div class="grid grid-cols-2 gap-4 pt-4 font-mono text-xs sm:grid-cols-4">
			<div class="glass-card rounded-xl p-3">
				<p class="text-[10px] text-slate-400 uppercase">Extractor Core</p>
				<p class="mt-1 font-bold text-cyan-300">{systemStatus.ytdlp}</p>
			</div>
			<div class="glass-card rounded-xl p-3">
				<p class="text-[10px] text-slate-400 uppercase">Transcoder</p>
				<p class="mt-1 font-bold text-emerald-400">FFmpeg {systemStatus.ffmpeg}</p>
			</div>
			<div class="glass-card rounded-xl p-3">
				<p class="text-[10px] text-slate-400 uppercase">SSE Stream pipeline</p>
				<p class="mt-1 font-bold text-blue-400">{systemStatus.sseStream}</p>
			</div>
			<div class="glass-card rounded-xl p-3">
				<p class="text-[10px] text-slate-400 uppercase">API Latency</p>
				<p class="mt-1 font-bold text-purple-400">{systemStatus.latency}</p>
			</div>
		</div>
	</div>

	<!-- Workflow / How It Works -->
	<div class="space-y-6">
		<div class="space-y-2 text-center">
			<span class="text-xs font-bold tracking-widest text-cyan-300 uppercase"
				>Streamlined Process</span
			>
			<h2 class="text-2xl font-bold text-white sm:text-3xl">How Streamy Works</h2>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each workflowSteps as item}
				<div class="glass-card relative space-y-3 rounded-2xl p-6">
					<span class="text-3xl font-black text-cyan-500/20">{item.step}</span>
					<h3 class="text-base font-bold text-white">{item.title}</h3>
					<p class="text-xs leading-relaxed text-slate-300">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Feature Grid Showcase -->
	<div class="space-y-6">
		<div class="space-y-2 text-center">
			<h2 class="text-2xl font-bold text-white sm:text-3xl">Engineered for Quality</h2>
			<p class="text-sm text-slate-400">Everything you need for clean, reliable media downloads.</p>
		</div>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
			{#each features as feature}
				<div
					class="glass-card flex flex-col space-y-3 rounded-2xl p-7 transition hover:border-cyan-500/30"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/50 bg-cyan-500/10 text-cyan-300 shadow-inner"
					>
						{#if feature.icon}
							<Icon src={feature.icon} className="w-6 h-6" />
						{/if}
					</div>
					<h3 class="text-lg font-bold text-white">{feature.title}</h3>
					<p class="text-xs leading-relaxed text-slate-300 sm:text-sm">
						{feature.description}
					</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Capabilities & Technical Specifications -->
	<div class="glass-panel space-y-8 rounded-3xl p-6 sm:p-10">
		<div class="space-y-2 text-center sm:text-left">
			<span class="text-xs font-bold tracking-widest text-cyan-300 uppercase"
				>Platform Capabilities</span
			>
			<h2 class="text-2xl font-black text-white sm:text-3xl">System Specifications</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
			{#each specs as spec}
				<div class="glass-card space-y-4 rounded-2xl border border-white/5 p-6">
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-cyan-500/10 text-cyan-300"
						>
							{#if spec.icon}
								<Icon src={spec.icon} className="w-5 h-5" />
							{/if}
						</div>
						<h3 class="text-sm leading-tight font-bold text-white">{spec.title}</h3>
					</div>
					<ul class="space-y-2 border-t border-white/10 pt-2 text-xs text-slate-300">
						{#each spec.items as item}
							<li class="flex items-center gap-2">
								{#if LuCheck}
									<Icon src={LuCheck} className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
								{/if}
								<span>{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<!-- Accordion Interactive FAQ Section -->
	<div class="glass-panel-glow space-y-8 rounded-3xl p-6 sm:p-10">
		<div
			class="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-cyan-500/10 text-cyan-300 shadow-inner"
				>
					{#if LuCircleHelp}
						<Icon src={LuCircleHelp} className="w-5 h-5" />
					{/if}
				</div>
				<div>
					<h2 class="text-2xl font-black text-white">Frequently Asked Questions</h2>
					<p class="text-xs text-slate-400">
						Everything you need to know about converted media & streams.
					</p>
				</div>
			</div>

			<!-- Search Filter Input -->
			<div class="relative min-w-60">
				<input
					type="text"
					bind:value={faqQuery}
					placeholder="Search questions..."
					class="w-full rounded-xl border border-white/10 bg-black/40 py-2 pr-4 pl-9 text-xs text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none"
				/>
				<div class="absolute top-2.5 left-3 text-slate-400">
					{#if LuSearch}
						<Icon src={LuSearch} className="w-3.5 h-3.5" />
					{/if}
				</div>
			</div>
		</div>

		<div class="space-y-3">
			{#each filteredFaqs as faq, index}
				<div
					class="glass-card overflow-hidden rounded-2xl border transition-all duration-200 {openFaq ===
					index
						? 'border-cyan-500/40 bg-white/10'
						: 'border-white/5 hover:border-white/15'}"
				>
					<button
						type="button"
						onclick={() => toggleFaq(index)}
						class="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
					>
						<span class="text-sm font-bold text-white sm:text-base">{faq.question}</span>
						<div
							class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-transform duration-200 {openFaq ===
							index
								? 'rotate-180 text-cyan-300'
								: ''}"
						>
							{#if LuChevronDown}
								<Icon src={LuChevronDown} className="w-4 h-4" />
							{/if}
						</div>
					</button>

					{#if openFaq === index}
						<div
							class="animate-in fade-in border-t border-white/10 bg-black/20 p-5 text-xs leading-relaxed text-slate-300 duration-200 sm:text-sm"
						>
							{faq.answer}
						</div>
					{/if}
				</div>
			{:else}
				<div class="py-8 text-center text-xs text-slate-400">
					No questions matching "{faqQuery}". Try searching for another keyword.
				</div>
			{/each}
		</div>
	</div>

	<!-- Call to Action Banner -->
	<div
		class="glass-panel flex flex-col items-center justify-between gap-6 rounded-3xl p-8 text-center sm:flex-row sm:p-10 sm:text-left"
	>
		<div class="space-y-2">
			<h3 class="text-xl font-extrabold text-white sm:text-2xl">
				Ready to download your favorite media?
			</h3>
			<p class="max-w-lg text-xs text-slate-300 sm:text-sm">
				Convert videos or audio tracks in seconds without ads, limits, or registration.
			</p>
		</div>
		<a
			href="/"
			class="glass-button flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-7 py-4 text-xs font-bold text-white transition active:scale-[0.98]"
		>
			{#if LuDownload}
				<Icon src={LuDownload} className="w-4 h-4" />
			{/if}
			<span>Start Converting Now</span>
			{#if LuArrowRight}
				<Icon src={LuArrowRight} className="w-4 h-4" />
			{/if}
		</a>
	</div>
</div>
