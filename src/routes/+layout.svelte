<script>
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

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

	<!-- Sticky Navigation Header -->
	<Navbar />

	<!-- Main Content Slot -->
	<main class="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-6">
		{@render children()}
	</main>

	<!-- Footer -->
	<div class="relative z-10">
		<Footer />
	</div>
</div>
