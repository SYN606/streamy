<script>
	// svelte-icons-pack imports
	import { Icon } from 'svelte-icons-pack';
	import {
		LuPlay,
		LuGithub,
		LuHeart,
		LuShieldCheck,
		LuZap,
		LuActivity,
		LuExternalLink
	} from 'svelte-icons-pack/lu';

	const currentYear = new Date().getFullYear();

	const footerSections = [
		{
			title: 'Navigation',
			links: [
				{ label: 'Home Extractor', href: '/' },
				{ label: 'Playlist Downloader', href: '/playlist' },
				{ label: 'Download History', href: '/history' },
				{ label: 'About & FAQ', href: '/about' }
			]
		},
		{
			title: 'Supported Services',
			links: [
				{ label: 'YouTube Video & Audio', href: '/' },
				{ label: 'Playlist Extraction', href: '/playlist' },
				{ label: 'Format Converter', href: '/' },
				{ label: 'High Quality MP3 / MP4', href: '/' }
			]
		},
		{
			title: 'Legal & Resources',
			links: [
				{ label: 'Terms of Service', href: '/about' },
				{ label: 'Privacy Policy', href: '/about' },
				{ label: 'Open Source', href: 'https://github.com', external: true },
				{ label: 'API Documentation', href: '/about', external: false }
			]
		}
	];
</script>

<footer class="mx-auto mt-auto w-full max-w-5xl px-4 pt-16 pb-8">
	<div class="glass-panel-glow flex flex-col gap-10 rounded-3xl p-8 sm:p-10">
		<!-- Top Section: Brand & Navigation Links -->
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
			<!-- Brand Column (2 Spans wide on desktop) -->
			<div class="space-y-4 lg:col-span-2">
				<a href="/" class="group inline-flex items-center gap-2.5">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-linear-to-brrom-cyan-400/20 via-sky-500/10 to-blue-600/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition duration-300 group-hover:scale-105 group-hover:border-glass-border-hover"
					>
						<Icon src={LuPlay} className="w-5 h-5 text-cyan-300 fill-cyan-300/40" />
					</div>
					<span class="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300">
						Streamy<span class="text-cyan-400">.</span>
					</span>
				</a>

				<p class="max-w-sm text-xs leading-relaxed text-slate-300">
					High-performance, ultra-fast media converter and playlist extractor. Extract pure HD audio
					and video directly in your browser without ad-trackers.
				</p>

				<!-- Status Badges -->
				<div class="flex flex-wrap items-center gap-2 pt-2">
					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400 backdrop-blur-md"
					>
						<span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
						Operational
					</span>

					<span
						class="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-accent backdrop-blur-md"
					>
						<Icon src={LuZap} className="w-3 h-3 text-cyan-300" />
						v2.0 Turbo
					</span>
				</div>
			</div>

			<!-- Dynamic Navigation Columns -->
			{#each footerSections as section}
				<div class="space-y-3">
					<h4 class="text-xs font-bold tracking-wider text-cyan-300 uppercase">
						{section.title}
					</h4>
					<ul class="space-y-2 text-xs">
						{#each section.links as link}
							<li>
								<a
									href={link.href}
									target={link.external ? '_blank' : '_self'}
									rel={link.external ? 'noreferrer' : ''}
									class="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-cyan-200"
								>
									<span>{link.label}</span>
									{#if link.external}
										<Icon src={LuExternalLink} className="w-3 h-3 text-slate-500" />
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Divider -->
		<div class="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

		<!-- Bottom Bar: Copyright & Socials -->
		<div
			class="flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row"
		>
			<p class="flex items-center gap-1 text-center sm:text-left">
				<span>© {currentYear} Streamy Inc. Built with</span>
				<Icon src={LuHeart} className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/40" />
				<span>for high speed streaming.</span>
			</p>

			<div class="flex items-center gap-4">
				<a
					href="https://github.com"
					target="_blank"
					rel="noreferrer"
					class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-200"
				>
					<Icon src={LuGithub} className="w-4 h-4 text-cyan-300" />
					<span>Source Code</span>
				</a>

				<a
					href="/about"
					class="flex items-center gap-1 text-slate-400 transition hover:text-cyan-300"
				>
					<Icon src={LuShieldCheck} className="w-4 h-4 text-cyan-400" />
					<span>Privacy</span>
				</a>
			</div>
		</div>
	</div>
</footer>
