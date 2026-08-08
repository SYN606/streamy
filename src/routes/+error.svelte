<script>
	import { page } from '$app/stores';
</script>

<div class="flex min-h-[65vh] flex-col items-center justify-center py-6 text-center">
	<div
		class="glass-panel relative w-full max-w-lg overflow-hidden rounded-3xl p-8 shadow-2xl backdrop-blur-2xl sm:p-12"
	>
		<!-- Background Accent Glows -->
		<div
			class="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-sky-500/25 blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl"
		></div>

		<!-- Error Status Code -->
		<span
			class="mb-4 inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-sky-400 uppercase backdrop-blur-md"
		>
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400"></span>
			Error {$page.status || 404}
		</span>

		<h1 class="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			{#if $page.status === 404}
				Page Not Found
			{:else}
				Something Went Wrong
			{/if}
		</h1>

		<p class="mb-8 text-base leading-relaxed text-slate-300">
			{$page.error?.message ||
				"The page or media resource you're looking for doesn't exist or has been moved."}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="/"
				class="glass-button w-full cursor-pointer rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition sm:w-auto"
			>
				Back to Downloader
			</a>
			<button
				onclick={() => window.location.reload()}
				class="w-full cursor-pointer rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:bg-white/20 hover:text-white sm:w-auto"
			>
				Try Again
			</button>
		</div>
	</div>
</div>
