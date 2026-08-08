<div class="mx-auto max-w-3xl space-y-10 py-4">
	<!-- Hero Header -->
	<div class="space-y-3 text-center">
		<span
			class="inline-block rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-sky-400 uppercase"
		>
			About Streamy
		</span>
		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			High-Performance <span class="text-sky-400">Media Extraction</span>
		</h1>
		<p class="mx-auto max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
			Streamy is a lightweight, zero-storage YouTube media converter designed to stream audio and
			video straight to your device.
		</p>
	</div>

	<!-- Core Features Grid -->
	<div class="grid gap-4 sm:grid-cols-2">
		<div class="glass-card space-y-2 rounded-2xl p-5">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sm font-bold text-sky-400"
			>
				⚡
			</div>
			<h3 class="text-base font-semibold text-white">Direct Stream Piping</h3>
			<p class="text-xs leading-relaxed text-slate-400">
				Media is streamed chunk-by-chunk through memory to your browser, eliminating wait times and
				server disk storage bottlenecks.
			</p>
		</div>

		<div class="glass-card space-y-2 rounded-2xl p-5">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-sm font-bold text-cyan-400"
			>
				🔒
			</div>
			<h3 class="text-base font-semibold text-white">Privacy First</h3>
			<p class="text-xs leading-relaxed text-slate-400">
				We don't track download history on server databases. Your conversions are private and
				transient.
			</p>
		</div>
	</div>

	<!-- FAQ Section -->
	<div class="glass-panel space-y-6 rounded-3xl p-6 sm:p-8">
		<h2 class="text-xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>

		<div class="space-y-4 divide-y divide-white/5">
			<div class="space-y-1 pt-4 first:pt-0">
				<h4 class="text-sm font-semibold text-slate-200">Is there a download size limit?</h4>
				<p class="text-xs leading-relaxed text-slate-400">
					No hard file size limits are enforced. However, speed and performance depend on your
					network connection and YouTube's response rates.
				</p>
			</div>

			<div class="space-y-1 pt-4">
				<h4 class="text-sm font-semibold text-slate-200">What formats are supported?</h4>
				<p class="text-xs leading-relaxed text-slate-400">
					Streamy supports direct MP4 video downloads, as well as MP3, M4A, and WebM audio
					extractions.
				</p>
			</div>

			<div class="space-y-1 pt-4">
				<h4 class="text-sm font-semibold text-slate-200">What technology powers Streamy?</h4>
				<p class="text-xs leading-relaxed text-slate-400">
					Built with SvelteKit, Bun runtime, Tailwind CSS v4, and powered under the hood by <code
						class="rounded bg-sky-950/50 px-1 py-0.5 text-sky-300">yt-dlp</code
					>.
				</p>
			</div>
		</div>
	</div>
</div>
