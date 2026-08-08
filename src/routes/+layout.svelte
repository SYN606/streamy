<script>
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Ambient Glowing Background Bubbles (Sapphire & Cyan Glow) -->
<div class="fixed inset-0 -z-10 min-h-screen overflow-hidden bg-slate-950">
	<!-- Top Left Cyan Glow -->
	<div
		class="pointer-events-none absolute -top-40 -left-40 h-125500px] rounded-full bg-cyan-500/20 blur-[140px]"
	></div>
	<!-- Middle Right Deep Sapphire Glow -->
	<div
		class="pointer-events-none absolute top-1/3 -right-40 h-150 w-150 rounded-full bg-blue-600/15 blur-[160px]"
	></div>
	<!-- Bottom Left Electric Blue Glow -->
	<div
		class="pointer-events-none absolute bottom-10 left-1/3 h-100 w-100 rounded-full bg-sky-500/10 blur-[130px]"
	></div>
</div>

<div class="flex min-h-screen flex-col justify-between py-4 font-sans text-slate-100 antialiased">
	<Navbar />

	<main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
		{@render children()}
	</main>

	<Footer />
</div>
