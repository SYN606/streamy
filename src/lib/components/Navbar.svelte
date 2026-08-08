<script>
	import { page } from '$app/stores';

	const navItems = [
		{ name: 'Downloader', href: '/' },
		{ name: 'Playlist', href: '/playlist' },
		{ name: 'History', href: '/history' },
		{ name: 'About', href: '/about' }
	];
</script>

<header class="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4">
	<nav class="glass-panel flex h-16 items-center justify-between rounded-2xl px-5 shadow-2xl">
		<!-- Brand Logo -->
		<a href="/" class="group flex items-center gap-3 transition-transform active:scale-95">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-b from-sky-400 to-blue-600 text-xs font-black text-white shadow-md shadow-sky-500/20"
			>
				▶
			</div>
			<span class="text-xl font-bold tracking-tight text-white">
				Stream<span class="text-sky-400">y</span>
			</span>
		</a>

		<!-- Navigation Links -->
		<div class="flex items-center gap-1.5 sm:gap-2">
			{#each navItems as item}
				{@const active = $page.url.pathname === item.href}
				<a
					href={item.href}
					class="relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 {active
						? 'border border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-md'
						: 'text-slate-300 hover:bg-white/10 hover:text-white'}"
				>
					{item.name}
				</a>
			{/each}
		</div>
	</nav>
</header>
