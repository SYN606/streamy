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
	<nav
		class="glass-panel flex h-16 items-center justify-between rounded-2xl px-5 shadow-2xl shadow-black/50"
	>
		<!-- Brand Logo -->
		<a href="/" class="group flex items-center gap-2.5">
			<div
				class="rounded-xl bg-red-600/90 p-2 text-xs font-black text-white shadow-lg shadow-red-600/30 transition-transform group-hover:scale-105"
			>
				▶
			</div>
			<span class="text-lg font-bold tracking-tight text-white">
				Stream<span class="text-red-500">y</span>
			</span>
		</a>

		<!-- Navigation Links -->
		<div class="flex items-center gap-1 sm:gap-2">
			{#each navItems as item}
				{@const active = $page.url.pathname === item.href}
				<a
					href={item.href}
					class="relative rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm {active
						? 'border border-white/10 bg-white/10 text-white shadow-inner'
						: 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'}"
				>
					{item.name}
				</a>
			{/each}
		</div>
	</nav>
</header>
