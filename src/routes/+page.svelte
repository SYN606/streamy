<script>
	import VideoCard from '$lib/components/VideoCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	// svelte-icons-pack imports
	import { Icon } from 'svelte-icons-pack';
	import {
		LuLink,
		LuX,
		LuArrowRight,
		LuCircleAlert,
		LuLoader,
		LuSparkles
	} from 'svelte-icons-pack/lu';
	import { FaBrandsYoutube } from 'svelte-icons-pack/fa';

	let url = $state('');
	let loading = $state(false);
	let videoData = $state(null);
	let errorMsg = $state('');

	// Real-Time Progress State
	let progress = $state(0);
	let isDownloading = $state(false);
	let downloadStatus = $state('');

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
		downloadStatus = selectedFormat.startsWith('mp3')
			? 'Converting to High Quality MP3 & embedding tags...'
			: 'Downloading media stream...';

		const sseUrl = `/api/progress?url=${encodeURIComponent(url)}&format=${encodeURIComponent(selectedFormat)}`;
		const eventSource = new EventSource(sseUrl);

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.percent !== undefined) {
				progress = data.percent;
			}

			if (data.status) {
				downloadStatus = data.status;
			}

			if (data.done) {
				eventSource.close();

				// Trigger file save from the temp_downloads path
				window.location.href = `/api/download?url=${encodeURIComponent(url)}&format_id=${encodeURIComponent(selectedFormat)}`;

				setTimeout(() => {
					isDownloading = false;
					progress = 100;
				}, 1200);
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
			isDownloading = false;
			errorMsg = 'Download connection interrupted. Please try again.';
		};
	}

	function clearInput() {
		url = '';
		videoData = null;
		errorMsg = '';
	}
</script>

<div class="mx-auto max-w-2xl space-y-8 px-4 py-6">
	<!-- Hero Header -->
	<div class="space-y-3 text-center">
		<div
			class="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-400 backdrop-blur-md"
		>
			<Icon src={LuSparkles} className="w-3.5 h-3.5 text-sky-400" />
			<span>Fast & Private Downloader</span>
		</div>

		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
			Convert & Download <br />
			<span
				class="bg-linear-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent"
			>
				Media Instantly
			</span>
		</h1>
		<p class="mx-auto max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
			Paste any YouTube link below to extract high quality MP3s with cover art or HD video streams
			directly.
		</p>
	</div>

	<!-- Form Input Panel -->
	<form
		onsubmit={handleSubmit}
		class="glass-panel relative flex flex-col gap-2.5 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl transition focus-within:border-sky-500/50 sm:flex-row sm:p-3"
	>
		<div class="relative flex flex-1 items-center">
			<div class="absolute left-4 flex items-center justify-center text-slate-400">
				<Icon src={LuLink} className="w-5 h-5" />
			</div>

			<input
				type="url"
				bind:value={url}
				placeholder="Paste video or audio link here..."
				required
				disabled={loading || isDownloading}
				class="glass-input w-full rounded-xl py-3.5 pr-10 pl-11 text-sm text-white placeholder-slate-400 focus:outline-none sm:text-base"
			/>

			{#if url}
				<button
					type="button"
					onclick={clearInput}
					class="absolute right-3 rounded-lg p-1 text-slate-400 transition hover:text-white"
					aria-label="Clear input"
				>
					<Icon src={LuX} className="w-4 h-4" />
				</button>
			{/if}
		</div>

		<button
			type="submit"
			disabled={loading || isDownloading || !url.trim()}
			class="glass-button group relative flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
		>
			{#if loading}
				<Icon src={LuLoader} className="w-5 h-5 animate-spin text-white" />
				<span>Processing...</span>
			{:else}
				<span>Fetch Formats</span>
				<Icon
					src={LuArrowRight}
					className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
				/>
			{/if}
		</button>
	</form>

	<!-- Error Alert Box -->
	{#if errorMsg}
		<div
			class="glass-card flex items-center justify-center gap-2.5 rounded-2xl border border-red-500/30 bg-red-950/30 p-4 text-center text-sm font-medium text-red-300 shadow-xl backdrop-blur-md"
		>
			<Icon src={LuCircleAlert} className="w-5 h-5 text-red-400 shrink-0" />
			<span>{errorMsg}</span>
		</div>
	{/if}

	<!-- Real-Time Progress Bar -->
	{#if isDownloading}
		<div class="space-y-2">
			<p class="animate-pulse text-center text-xs font-medium text-slate-400">{downloadStatus}</p>
			<ProgressBar {progress} {isDownloading} />
		</div>
	{/if}

	<!-- Video Metadata & Format Results Card -->
	{#if videoData}
		<VideoCard video={videoData} originalUrl={url} onDownload={handleStartDownload} />
	{/if}
</div>
