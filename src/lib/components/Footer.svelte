<script>
	// svelte-icons-pack imports
	import { Icon } from 'svelte-icons-pack';
	import {
		LuPlay,
		LuGithub,
		LuHeart,
		LuShieldCheck,
		LuZap,
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
				{ label: 'Open Source', href: 'https://github.com/syn606/streamy', external: true },
				{ label: 'API Documentation', href: '/about', external: false }
			]
		}
	];
</script>

<footer class="mt-auto w-full border-t border-white/10 bg-slate-950/80 pt-12 pb-8 backdrop-blur-xl">
	<div class="w-full px-4 sm:px-8 lg:px-12">
		<div class="glass-panel-glow flex flex-col gap-10 rounded-3xl p-8 sm:p-12">
			<!-- Top Section: Brand & Navigation Links -->
			<div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
				<!-- Brand Column -->
				<div class="space-y-4 lg:col-span-2">
					<a href="/" class="group inline-flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br from-cyan-400/20 via-sky-500/10 to-blue-600/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition duration-300 group-hover:scale-105 group-hover:border-cyan-400/40"
						>
							{#if LuPlay}
								<Icon src={LuPlay} className="w-6 h-6 text-cyan-300 fill-cyan-300/40" />
							{/if}
						</div>
						<span class="text-2xl font-black tracking-tight text-white group-hover:text-cyan-300">
							Streamy<span class="text-cyan-400">.</span>
						</span>
					</a>

					<p class="max-w-md text-sm leading-relaxed text-slate-300">
						High-performance, ultra-fast media converter and playlist extractor. Extract pure HD
						audio and video directly in your browser without ad-trackers or telemetry.
					</p>

					<!-- Status Badges -->
					<div class="flex flex-wrap items-center gap-2.5 pt-2">
						<span
							class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md"
						>
							<span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
							Operational
						</span>

						<span
							class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md"
						>
							{#if LuZap}
								<Icon src={LuZap} className="w-3.5 h-3.5 text-cyan-300" />
							{/if}
							v2.0 Turbo
						</span>
					</div>
				</div>

				<!-- Dynamic Navigation Columns -->
				{#each footerSections as section}
					<div class="space-y-4">
						<h4 class="text-sm font-extrabold tracking-wider text-cyan-300 uppercase">
							{section.title}
						</h4>
						<ul class="space-y-2.5 text-sm">
							{#each section.links as link}
								<li>
									<a
										href={link.href}
										target={link.external ? '_blank' : '_self'}
										rel={link.external ? 'noreferrer' : ''}
										class="inline-flex items-center gap-1.5 font-medium text-slate-300 transition-colors hover:text-cyan-200"
									>
										<span>{link.label}</span>
										{#if link.external && LuExternalLink}
											<Icon src={LuExternalLink} className="w-3.5 h-3.5 text-slate-500" />
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<!-- Divider -->
			<div class="h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent"></div>

			<!-- Bottom Bar: Copyright, Credits & Socials -->
			<div
				class="flex flex-col items-center justify-between gap-5 text-sm font-medium text-slate-300 sm:flex-row"
			>
				<div class="flex flex-wrap items-center justify-center gap-2 text-center sm:text-left">
					<span>© {currentYear} Streamy Inc.</span>
					<span class="text-slate-600">•</span>
					<span class="inline-flex items-center gap-1.5">
						Made with
						{#if LuHeart}
							<Icon src={LuHeart} className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
						{/if}
						by
						<a
							href="https://syn606.wtf/"
							target="_blank"
							rel="noreferrer"
							class="font-bold text-cyan-300 transition hover:text-cyan-200 hover:underline"
						>
							SYN 606
						</a>
					</span>
				</div>

				<div class="flex items-center gap-5">
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur-md transition hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:text-cyan-200"
					>
						{#if LuGithub}
							<Icon src={LuGithub} className="w-4 h-4 text-cyan-300" />
						{/if}
						<span>Source Code</span>
					</a>

					<a
						href="/about"
						class="flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-cyan-300"
					>
						{#if LuShieldCheck}
							<Icon src={LuShieldCheck} className="w-4 h-4 text-cyan-400" />
						{/if}
						<span>Privacy</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>
