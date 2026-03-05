<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Layout2 from '$components/layouts/Layout2.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let isPortrait = $state(true);
	let isMobile = $state(false);
	let showAnswerTab = $state(false);

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
	<!-- Demo button -->
	{#if !isPortrait && isMobile}
		<Button
			onclick={() => (showAnswerTab = !showAnswerTab)}
			class="fixed top-4 left-4 z-50 flex items-center justify-center border-2 border-foreground bg-white px-4 py-2 font-semibold hover:bg-white active:bg-white"
		>
			Demo
		</Button>
	{/if}

	<!-- Answer tab -->
	{#if showAnswerTab && !isPortrait && isMobile}
		<div
			class="fixed inset-0 z-30 bg-black/30"
			onclick={() => (showAnswerTab = false)}
			role="presentation"
		></div>
		<div
			class="fixed right-0 bottom-0 left-0 z-40 flex flex-col gap-4 border-t-2 border-foreground bg-white p-4"
			in:fly={{ y: 300, duration: 400 }}
		>
			<GameButton>Answer 1</GameButton>
			<GameButton>Answer 2</GameButton>
			<GameButton>Answer 3</GameButton>
		</div>
	{/if}
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
