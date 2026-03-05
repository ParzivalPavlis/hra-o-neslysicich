<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount } from 'svelte';

	let isPortrait = $state(true);
	let isMobile = $state(false);

	function checkOrientation() {
		// Check if device is mobile
		const userAgent = navigator.userAgent.toLowerCase();
		isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);

		// Check if in portrait mode
		isPortrait = window.innerHeight > window.innerWidth;
	}

	onMount(() => {
		checkOrientation();
	});
</script>

<svelte:head>
	<title>Úroveň 4</title>
</svelte:head>

<svelte:window on:orientationchange={checkOrientation} on:resize={checkOrientation} />
<Layout2>
	{#if isMobile && isPortrait}
		<div class="flex h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center">
			<div class="text-5xl">📱</div>
			<Paragraph className="text-xl font-semibold">
				Prosím otočte zařízení do vodorovné polohy
			</Paragraph>
		</div>
	{:else}
		<div class="flex w-full flex-col items-center justify-center landscape:gap-2">
			<div
				class="aspect-video w-full max-w-6xl overflow-hidden rounded-lg bg-gray-900 landscape:h-auto landscape:max-h-[calc(100vh-2rem)]"
			>
				<iframe
					class="h-full w-full"
					src="https://www.youtube.com/embed/cPr-MIKTNK4"
					title="YouTube video"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullscreen
				></iframe>
			</div>
		</div>
	{/if}
</Layout2>
