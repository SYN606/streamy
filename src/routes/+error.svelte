<script>
	import { page } from '$app/stores';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center text-center">
	<div
		class="glass-panel relative w-full max-w-lg overflow-hidden rounded-3xl p-8 shadow-2xl sm:p-12"
	>
		<!-- Background Accent Glow -->
		<div
			class="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"
		></div>

		<!-- Error Status Code -->
		<span
			class="mb-4 inline-block rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-sky-400 uppercase"
		>
			Error {$page.status || 404}
		</span>

		<h1 class="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			{#if $page.status === 404}
				Page Not Found
			{:else}
				Something Went Wrong
			{/if}
		</h1>

		<p class="mb-8 text-sm leading-relaxed text-slate-400">
			{$page.error?.message ||
				"The page or media resource you're looking for doesn't exist or has been moved."}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="/"
				class="glass-button w-full cursor-pointer rounded-xl px-6 py-3 text-xs font-semibold tracking-wide text-white transition sm:w-auto"
			>
				Back to Downloader
			</a>
			<button
				onclick={() => window.location.reload()}
				class="w-full cursor-pointer rounded-xl border border-white/10 bg-slate-800/60 px-6 py-3 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 sm:w-auto"
			>
				Try Again
			</button>
		</div>
	</div>
</div>
