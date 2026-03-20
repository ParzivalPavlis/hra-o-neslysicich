<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import LevelButton from '$components/LevelButton.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { levels } from '$lib/levels';
	import { lastPlayedStore } from '$lib/stores/lastPlayed';
	import { levelFirstThreeStarsStore } from '$lib/stores/levelFirstThreeStars';
	import type { GameProgressType } from '$types/supabase/gameProgress';
	import { ArrowUp, ArrowDown, ChevronUp, ChevronDown } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let gameProgress = $derived(data.gameProgress);
	let levelButtonRefs: HTMLDivElement[] = $state([]);
	let levelMapImages = [
		{ level: 1, src: '/assets/levelMap/manDrinking.png' },
		{ level: 2, src: '/assets/levelMap/womanReading.png' },
		{ level: 4, src: '/assets/levelMap/manDoctor.png' },
		{ level: 7, src: '/assets/levelMap/peopleSigning.png' }
	];

	// Merge game progress with levels data
	const levelsWithProgress = $derived(
		levels.map((level, index) => {
			const levelKey = `level${index + 1}` as keyof GameProgressType['levels'];
			const progress = gameProgress?.levels[levelKey];

			return {
				...level,
				stars: progress?.stars ?? level.stars,
				completed: progress?.completed ?? false,
				locked: progress?.locked ?? level.locked
			};
		})
	);

	console.log($levelFirstThreeStarsStore);

	afterNavigate(() => {
		if ($lastPlayedStore.levelNumber) {
			setTimeout(() => {
				const levelButton = document.getElementById(`level-${$lastPlayedStore.levelNumber}`);
				if (levelButton) {
					levelButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}, 200);
		} else {
			window.scrollTo(0, 0);
		}
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function scrollToBottom() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	function scrollUpClosest() {
		const currentY = window.scrollY + window.innerHeight / 2;
		const visibleButtons = levelButtonRefs
			.filter((ref) => ref && ref.offsetTop + ref.offsetHeight / 2 < currentY - 100)
			.sort((a, b) => b.offsetTop - a.offsetTop);

		if (visibleButtons[0]) {
			visibleButtons[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function scrollDownClosest() {
		const currentY = window.scrollY + window.innerHeight / 2;
		const visibleButtons = levelButtonRefs
			.filter((ref) => ref && ref.offsetTop > currentY + 100)
			.sort((a, b) => a.offsetTop - b.offsetTop);

		if (visibleButtons[0]) {
			visibleButtons[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
</script>

<svelte:head>
	<title>Úrovně</title>
</svelte:head>

<div class="relative flex min-h-screen flex-col items-center gap-50 overflow-x-hidden p-10">
	{#each levelsWithProgress as { icon, stars, locked, completed, description, trails, href }, index}
		<div class="relative flex w-full justify-center" bind:this={levelButtonRefs[index]}>
			<div class="hidden w-60 md:flex">
				{#if index % 2 === 0}
					{#if levelMapImages.find((img) => img.level === index + 1)}
						<!-- svelte-ignore a11y_missing_attribute -->
						<img
							src={levelMapImages.find((img) => img.level === index + 1)?.src || ''}
							class="hidden h-full w-full object-contain md:flex"
						/>
					{/if}
				{/if}
			</div>
			{#if index % 2 === 0}
				<!-- svelte-ignore a11y_missing_attribute -->
				<img
					src={levelMapImages.find((img) => img.level === index + 1)?.src || ''}
					class="absolute top-45 -left-12.5 flex h-70 md:hidden"
				/>
			{/if}
			<LevelButton
				attributes={{ icon, stars, locked, description, trails, level: index + 1, href }}
			/>
			<div class="hidden w-60 md:flex">
				{#if index % 2 !== 0}
					{#if levelMapImages.find((img) => img.level === index + 1)}
						<!-- svelte-ignore a11y_missing_attribute -->
						<img
							src={levelMapImages.find((img) => img.level === index + 1)?.src || ''}
							class="hidden h-full w-full object-contain md:flex"
						/>
					{/if}
				{/if}
			</div>
			{#if index % 2 !== 0}
				<!-- svelte-ignore a11y_missing_attribute -->
				<img
					src={levelMapImages.find((img) => img.level === index + 1)?.src || ''}
					class="absolute top-45 -right-12.5 flex h-70 md:hidden"
				/>
			{/if}
		</div>
	{/each}
</div>
<div class="fixed top-1/2 right-4 hidden -translate-y-1/2 transform flex-col gap-2 md:flex">
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollToTop}><ArrowUp /></Button>
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollUpClosest}><ChevronUp /></Button>
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollDownClosest}><ChevronDown /></Button>
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollToBottom}><ArrowDown /></Button>
</div>
