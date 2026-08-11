<script>
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import PlaylistHero from '$lib/components/playlist/PlaylistHero.svelte';
	import PlaylistForm from '$lib/components/playlist/PlaylistForm.svelte';
	import PlaylistHeader from '$lib/components/playlist/PlaylistHeader.svelte';
	import PlaylistBatchBar from '$lib/components/playlist/PlaylistBatchBar.svelte';
	import TrackItem from '$lib/components/playlist/TrackItem.svelte';

	import { Icon } from 'svelte-icons-pack';
	import {
		LuZap,
		LuVideo,
		LuTriangleAlert,
		LuCircleCheck,
		LuListMusic,
		LuSquare
	} from 'svelte-icons-pack/lu';

	let playlistUrl = $state('');
	let loading = $state(false);
	let playlistData = $state(null);
	let errorMsg = $state('');
	let selectedFormat = $state('mp3-320'); // Matches format_id expectations in backend API

	// Batch Selection & Queue State
	let selectedTrackIds = $state(new Set());
	let isDownloading = $state(false);
	let currentTrackIndex = $state(-1);
	let completedTrackIndices = $state(new Set());
	let currentBatchStep = $state(0);
	let totalBatchCount = $state(0);
	let progress = $state(0);

	const highlights = [
		{
			title: 'Batch Extraction',
			desc: 'Analyze and extract full YouTube or SoundCloud playlists in a single click.',
			icon: LuListMusic
		},
		{
			title: 'Multi-Format Engine',
			desc: 'Convert entire audio albums to 320kbps MP3s or video series up to 4K HD.',
			icon: LuVideo
		},
		{
			title: 'Real-Time SSE Feedback',
			desc: 'Monitor per-track progress, total queue status, and download speed in real-time.',
			icon: LuZap
		}
	];

	async function handleFetchPlaylist() {
		if (!playlistUrl.trim()) return;

		loading = true;
		errorMsg = '';
		playlistData = null;
		selectedTrackIds = new Set();
		completedTrackIndices = new Set();

		try {
			const res = await fetch('/api/playlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: playlistUrl })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Failed to analyze playlist URL.');
			}

			playlistData = data;
			if (data.entries && Array.isArray(data.entries)) {
				selectedTrackIds = new Set(data.entries.map((_, i) => i));
			}
		} catch (err) {
			errorMsg = err.message || 'Something went wrong while processing the playlist.';
		} finally {
			loading = false;
		}
	}

	function toggleTrackSelection(index) {
		const updated = new Set(selectedTrackIds);
		if (updated.has(index)) {
			updated.delete(index);
		} else {
			updated.add(index);
		}
		selectedTrackIds = updated;
	}

	function toggleSelectAll() {
		if (!playlistData?.entries) return;
		if (selectedTrackIds.size === playlistData.entries.length) {
			selectedTrackIds = new Set();
		} else {
			selectedTrackIds = new Set(playlistData.entries.map((_, i) => i));
		}
	}

	// Helper to prompt standard browser file download
	function triggerFileDownload(trackUrl) {
		const endpoint = `/api/download?url=${encodeURIComponent(trackUrl)}&format_id=${encodeURIComponent(selectedFormat)}`;
		const anchor = document.createElement('a');
		anchor.href = endpoint;
		anchor.setAttribute('download', '');
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	}

	function downloadTrackPromise(trackUrl, index) {
		return new Promise((resolve, reject) => {
			currentTrackIndex = index;
			progress = 0;

			const sseUrl = `/api/progress?url=${encodeURIComponent(trackUrl)}&format_id=${encodeURIComponent(selectedFormat)}`;
			const eventSource = new EventSource(sseUrl);
			let isDone = false;

			eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);

					if (data.percent !== undefined) {
						progress = data.percent;
					}

					if (data.done) {
						isDone = true;
						eventSource.close();
						const updatedCompleted = new Set(completedTrackIndices);
						updatedCompleted.add(index);
						completedTrackIndices = updatedCompleted;
						resolve();
					}
				} catch (err) {
					console.error('SSE parse error:', err);
				}
			};

			eventSource.onerror = () => {
				eventSource.close();
				if (isDone) return; // Prevent late error if done was reached
				reject(new Error(`Failed downloading track #${index + 1}`));
			};
		});
	}

	async function handleDownloadSingle(trackUrl, index) {
		if (isDownloading) return;
		isDownloading = true;
		currentBatchStep = 1;
		totalBatchCount = 1;
		errorMsg = '';

		try {
			await downloadTrackPromise(trackUrl, index);
			triggerFileDownload(trackUrl);
		} catch (err) {
			errorMsg = err.message || 'Download connection interrupted.';
		} finally {
			setTimeout(() => {
				isDownloading = false;
				currentTrackIndex = -1;
			}, 1000);
		}
	}

	async function handleBatchDownload() {
		if (!playlistData?.entries || selectedTrackIds.size === 0 || isDownloading) return;

		isDownloading = true;
		errorMsg = '';
		const indicesToDownload = Array.from(selectedTrackIds).sort((a, b) => a - b);
		totalBatchCount = indicesToDownload.length;

		for (let i = 0; i < indicesToDownload.length; i++) {
			const trackIdx = indicesToDownload[i];
			const track = playlistData.entries[trackIdx];
			currentBatchStep = i + 1;

			try {
				await downloadTrackPromise(track.url, trackIdx);
				triggerFileDownload(track.url);

				// Allow browser interval to register consecutive downloads
				await new Promise((r) => setTimeout(r, 1000));
			} catch (err) {
				console.error(`Error downloading track #${trackIdx + 1}:`, err);
				errorMsg = `Track #${trackIdx + 1} failed. Continuing remaining queue...`;
				// Continues execution loop instead of halting entire playlist
			}
		}

		setTimeout(() => {
			isDownloading = false;
			currentTrackIndex = -1;
		}, 1200);
	}
</script>

<div class="mx-auto max-w-5xl space-y-10 py-6">
	<PlaylistHero />

	<div class="space-y-4">
		<PlaylistForm bind:playlistUrl {loading} {isDownloading} onFetch={handleFetchPlaylist} />

		{#if errorMsg}
			<div
				class="glass-card flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-center text-sm font-medium text-red-300 shadow-xl"
			>
				{#if LuTriangleAlert}
					<Icon src={LuTriangleAlert} className="w-4 h-4 shrink-0 text-red-400" />
				{/if}
				<span>{errorMsg}</span>
			</div>
		{/if}

		{#if isDownloading}
			<ProgressBar
				{progress}
				{isDownloading}
				label="Batch Item {currentBatchStep}/{totalBatchCount} — Streaming Track #{currentTrackIndex +
					1}..."
			/>
		{/if}
	</div>

	{#if playlistData}
		<div class="space-y-6">
			<PlaylistHeader
				title={playlistData.title}
				uploader={playlistData.uploader}
				trackCount={playlistData.entries?.length || 0}
				bind:selectedFormat
				onDownloadAll={handleBatchDownload}
			/>

			<PlaylistBatchBar
				selectedCount={selectedTrackIds.size}
				totalCount={playlistData.entries?.length || 0}
				{isDownloading}
				onToggleSelectAll={toggleSelectAll}
				onBatchDownload={handleBatchDownload}
			/>

			<div class="space-y-2.5">
				{#each playlistData.entries as track, idx (track.id || idx)}
					<div class="flex items-center gap-3">
						<button
							type="button"
							onclick={() => toggleTrackSelection(idx)}
							class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
							aria-label="Toggle track selection"
						>
							{#if selectedTrackIds.has(idx)}
								{#if LuCircleCheck}
									<Icon src={LuCircleCheck} className="w-5 h-5 text-cyan-400" />
								{/if}
							{:else}
								{#if LuSquare}
									<Icon src={LuSquare} className="w-5 h-5 text-slate-500" />
								{/if}
							{/if}
						</button>
						<div class="grow">
							<TrackItem
								{track}
								index={idx}
								isDownloading={isDownloading && currentTrackIndex === idx}
								isComplete={completedTrackIndices.has(idx)}
								onDownload={() => handleDownloadSingle(track.url, idx)}
							/>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		{#each highlights as item}
			<div class="glass-card space-y-2.5 rounded-2xl p-6">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/50 bg-cyan-500/10 text-cyan-300 shadow-inner"
				>
					{#if item.icon}
						<Icon src={item.icon} className="w-5 h-5" />
					{/if}
				</div>
				<h3 class="text-base font-bold text-white">{item.title}</h3>
				<p class="text-xs leading-relaxed text-slate-300 sm:text-sm">
					{item.desc}
				</p>
			</div>
		{/each}
	</div>
</div>
