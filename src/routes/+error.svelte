<script>
	import { page } from '$app/state';

	// svelte-icons-pack imports
	import { Icon } from 'svelte-icons-pack';
	import { LuTriangleAlert, LuHouse, LuRotateCw, LuFileQuestion } from 'svelte-icons-pack/lu';

	const statusCode = page.status || 404;
	const errorMessage =
		page.error?.message ||
		"The page or media resource you're looking for doesn't exist, has been moved, or failed to process.";
</script>

<div class="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
	<div class="glass-panel-glow relative w-full max-w-lg overflow-hidden rounded-3xl p-8 sm:p-12">
		<!-- Background Ambient Glows -->
		<div
			class="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan-glow/20 blur-3xl"
		></div>
		<div
			class="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-glow/20 blur-3xl"
		></div>

		<!-- Animated Status Badge -->
		<div class="mb-6 flex justify-center">
			<div
				class="inline-flex items-center gap-2 rounded-full border border-glass-border bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan-accent uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md"
			>
				<Icon
					src={statusCode === 404 ? LuFileQuestion : LuTriangleAlert}
					className="w-4 h-4 text-cyan-300"
				/>
				<span>Error {statusCode}</span>
			</div>
		</div>

		<!-- Dynamic Title -->
		<h1 class="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			{#if statusCode === 404}
				Page Not Found
			{:else if statusCode === 500}
				Internal Server Error
			{:else}
				Something Went Wrong
			{/if}
		</h1>

		<!-- Error Message -->
		<p class="mb-8 text-sm leading-relaxed text-slate-300 sm:text-base">
			{errorMessage}
		</p>

		<!-- Action Buttons -->
		<div class="flex flex-col items-center justify-center gap-3.5 sm:flex-row">
			<a
				href="/"
				class="glass-button flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white sm:w-auto"
			>
				<Icon src={LuHouse} className="w-4 h-4" />
				<span>Back to Home</span>
			</a>
			<button
				onclick={() => window.location.reload()}
				class="glass-card flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:text-white sm:w-auto"
			>
				<Icon src={LuRotateCw} className="w-4 h-4 text-cyan-300" />
				<span>Try Again</span>
			</button>
		</div>
	</div>
</div>
