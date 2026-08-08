<script>
	import { page } from '$app/state';
	import { Icon } from 'svelte-icons-pack';
	import { LuPlay, LuHome, LuListMusic, LuHistory, LuInfo } from 'svelte-icons-pack/lu';

	const navItems = [
		{ name: 'Downloader', href: '/', icon: LuHome },
		{ name: 'Playlist', href: '/playlist', icon: LuListMusic },
		{ name: 'About', href: '/about', icon: LuInfo }
	];
</script>

<header class="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4">
	<nav
		class="glass-panel-glow flex h-16 items-center justify-between rounded-2xl px-5 shadow-2xl backdrop-blur-2xl"
	>
		<!-- Brand Logo -->
		<a href="/" class="group flex items-center gap-2.5 transition-transform active:scale-95">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-cyan-400/20 via-sky-500/10 to-blue-600/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition duration-300 group-hover:scale-105 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
			>
				{#if LuPlay}
					<Icon src={LuPlay} className="w-4 h-4 text-cyan-300 fill-cyan-300/40" />
				{/if}
			</div>
			<span
				class="text-xl font-extrabold tracking-tight text-white transition group-hover:text-cyan-300"
			>
				Stream<span class="text-cyan-400">y</span>
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
					<span class="hidden sm:inline">{item.name}</span>
				</a>
			{/each}
		</div>
	</nav>
</header>
