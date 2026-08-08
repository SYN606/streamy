<script>
	import './layout.css';
	import { page } from '$app/state';
	import Footer from '$lib/components/Footer.svelte';

	// svelte-icons-pack imports
	import { Icon } from 'svelte-icons-pack';
	import { LuPlay, LuHome, LuListMusic, LuHistory, LuInfo } from 'svelte-icons-pack/lu';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home', icon: LuHome },
		{ href: '/playlist', label: 'Playlist', icon: LuListMusic },
		{ href: '/history', label: 'History', icon: LuHistory },
		{ href: '/about', label: 'About', icon: LuInfo }
	];

	// Interactive Mouse Glow Tracker
	let mouseX = $state(0);
	let mouseY = $state(0);
	let isMoving = $state(false);

	function handleMouseMove(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
		isMoving = true;
	}
</script>

<!-- Window Mouse Listener for Cursor Glow -->
<svelte:window onmousemove={handleMouseMove} />

<div
	class="relative flex min-h-screen flex-col overflow-x-hidden bg-bg-surface text-cyan-50 antialiased selection:bg-cyan-500/30 selection:text-cyan-200"
>
	<!-- Background Layer 1: Dotted Grid Mesh -->
	<div
		class="pointer-events-none fixed inset-0 z-0 opacity-20"
		style="background-image: radial-gradient(var(--color-cyan-accent) 1px, transparent 1px); background-size: 28px 28px;"
	></div>

	<!-- Background Layer 2: Glowing Cyan/Blue Ambient Flares -->
	<div
		class="pointer-events-none fixed -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-glow/10 blur-[130px]"
	></div>
	<div
		class="pointer-events-none fixed top-1/3 -right-40 z-0 h-150 w-150 rounded-full bg-blue-glow/10 blur-[150px]"
	></div>

	<!-- Background Layer 3: Interactive Pointer Glow with Breathing Pulse Animation -->
	<div
		class="pointer-events-none fixed z-0 animate-pulse rounded-full transition-opacity duration-500"
		style="
            left: {mouseX}px; 
            top: {mouseY}px; 
            width: 480px; 
            height: 480px; 
            transform: translate(-50%, -50%); 
            background: radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(56, 189, 248, 0.04) 45%, transparent 70%);
            opacity: {isMoving ? 1 : 0};
            animation-duration: 3s;
        "
	></div>

	<!-- Sticky Glassmorphic Header -->
	<header class="sticky top-0 z-50 w-full px-4 pt-4 pb-2 backdrop-blur-2xl">
		<nav
			class="glass-panel-glow mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3"
		>
			<!-- Logo / Brand -->
			<a href="/" class="group flex items-center gap-2.5">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-xl border border-glass-border bg-linear-to-br from-cyan-400/20 via-sky-500/10 to-blue-600/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition duration-300 group-hover:scale-105 group-hover:border-glass-border-hover group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
				>
					<Icon src={LuPlay} className="w-4 h-4 text-cyan-300 fill-cyan-300/40" />
				</div>
				<span
					class="text-lg font-extrabold tracking-tight text-white transition group-hover:text-cyan-300"
				>
					Streamy<span class="text-cyan-400">.</span>
				</span>
			</a>

			<!-- Navigation Links -->
			<div
				class="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-1 backdrop-blur-md sm:gap-1.5"
			>
				{#each navItems as item}
					{@const active = page.url.pathname === item.href}
					<a
						href={item.href}
						class="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 {active
							? 'border border-cyan-400/30 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10'
							: 'text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-300'}"
					>
						{#if item.icon}
							<Icon src={item.icon} className="w-3.5 h-3.5 opacity-80" />
						{/if}
						<span class="hidden sm:inline">{item.label}</span>
					</a>
				{/each}
			</div>
		</nav>
	</header>

	<!-- Main Content Slot -->
	<main class="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-6">
		{@render children()}
	</main>

	<!-- Footer -->
	<div class="relative z-10">
		<Footer />
	</div>
</div>
