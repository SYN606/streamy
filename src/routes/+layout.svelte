<script>
	import './layout.css';
	import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/playlist', label: 'Playlist' },
		{ href: '/history', label: 'History' },
		{ href: '/about', label: 'About' }
	];
</script>

<div
	class="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200"
>
	<!-- Sticky iOS Glass Header -->
	<header class="sticky top-0 z-50 w-full px-4 pt-4 pb-2 backdrop-blur-xl">
		<nav
			class="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-5 py-3 shadow-2xl shadow-black/40 backdrop-blur-2xl"
		>
			<!-- Logo / Brand -->
			<a href="/" class="group flex items-center gap-2.5">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-400/30 bg-linear-to-br from-sky-400/20 to-blue-600/20 text-sky-400 shadow-inner transition group-hover:border-sky-400/50"
				>
					<svg class="h-4 w-4 fill-current" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
				</div>
				<span
					class="text-base font-extrabold tracking-tight text-white transition group-hover:text-sky-300"
				>
					Streamy
				</span>
			</a>

			<!-- Navigation Links -->
			<div
				class="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/60 p-1 backdrop-blur-md sm:gap-1.5"
			>
				{#each navItems as item}
					{@const active = $page.url.pathname === item.href}
					<a
						href={item.href}
						class="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all {active
							? 'border border-white/25 bg-white/20 text-white shadow-sm shadow-black/20'
							: 'text-slate-400 hover:bg-white/5 hover:text-white'}"
					>
						{item.label}
					</a>
				{/each}
			</div>
		</nav>
	</header>

	<!-- Main Body Container -->
	<main class="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
		{@render children()}
	</main>

	<!-- Footer -->
	<Footer />
</div>
