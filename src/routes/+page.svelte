<script>
	import VideoCard from '$lib/components/VideoCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	let url = $state('');
	let loading = $state(false);
	let videoData = $state(null);
	let errorMsg = $state('');

	// Real-Time Progress State
	let progress = $state(0);
	let isDownloading = $state(false);

	async function handleSubmit(e) {
		e.preventDefault();
		if (!url.trim()) return;

		loading = true;
		errorMsg = '';
		videoData = null;
		isDownloading = false;
		progress = 0;

		try {
			const res = await fetch('/api/info', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Failed to analyze media URL');
			}

			videoData = data;
		} catch (err) {
			errorMsg = err.message || 'Something went wrong. Please verify the URL.';
		} finally {
			loading = false;
		}
	}

	function handleStartDownload(selectedFormat) {
		isDownloading = true;
		progress = 0;

		const sseUrl = `/api/progress?url=${encodeURIComponent(url)}&format=${encodeURIComponent(selectedFormat)}`;
		const eventSource = new EventSource(sseUrl);

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.percent !== undefined) {
				progress = data.percent;
			}

			if (data.done) {
				eventSource.close();
				setTimeout(() => {
					isDownloading = false;
				}, 1200);
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			isDownloading = false;
			errorMsg = 'Download connection interrupted. Please try again.';
		};
	}
</script>

<div class="mx-auto max-w-2xl space-y-8 py-4">
	<!-- Hero Section -->
	<div class="space-y-3 text-center">
		<span
			class="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-400 backdrop-blur-md"
		>
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400"></span>
			Fast & Private Downloader
		</span>

		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
			Convert & Download <span
				class="bg-linear-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent"
				>Media Instantly</span
			>
		</h1>
		<p class="mx-auto max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
			Paste any YouTube link below to extract audio or high-definition video formats directly.
		</p>
	</div>

	<!-- Form Input -->
	<form
		onsubmit={handleSubmit}
		class="glass-panel flex flex-col gap-2.5 rounded-2xl p-2 shadow-2xl sm:flex-row sm:p-3"
	>
		<input
			type="url"
			bind:value={url}
			placeholder="Paste video or audio link here..."
			required
			class="glass-input flex-1 rounded-xl border border-white/10 px-4 py-3.5 text-base placeholder-slate-400 focus:border-sky-400 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={loading || isDownloading}
			class="glass-button flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition disabled:opacity-50"
		>
			{#if loading}
				<svg class="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					></path>
				</svg>
				<span>Processing...</span>
			{:else}
				<span>Fetch Formats</span>
			{/if}
		</button>
	</form>

	<!-- Error Alert -->
	{#if errorMsg}
		<div
			class="glass-card rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-center text-sm font-medium text-red-300 shadow-xl"
		>
			{errorMsg}
		</div>
	{/if}

	<!-- Real-Time Progress Stream Bar -->
	<ProgressBar {progress} {isDownloading} />

	<!-- Video Metadata & Format Results Card -->
	{#if videoData}
		<VideoCard video={videoData} originalUrl={url} onDownload={handleStartDownload} />
	{/if}
</div>
