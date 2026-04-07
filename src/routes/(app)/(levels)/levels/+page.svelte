<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import LevelButton from '$components/LevelButton.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { levels } from '$lib/levels';
	import { lastPlayedStore } from '$lib/stores/lastPlayed';
	import type { GameProgressType } from '$types/supabase/gameProgress';
	import { ArrowUp, ArrowDown, ChevronUp, ChevronDown } from '@lucide/svelte';
	import type { PageData } from './$types';
	import Particles from '$components/Particles.svelte';

	let { data }: { data: PageData } = $props();

	let gameProgress = $derived(data.gameProgress);
	let levelButtonRefs: HTMLDivElement[] = $state([]);
	let currentViewedLevelIndex: number | null = $state(null);
	let shouldPlayYellowAnimation: boolean = $state(false);
	let yellowAnimationLevelNumber: number | null = $state(null);
	let isYellowAnimationPlaying: boolean = $state(false);
	let shouldPlayUnlockAnimation: boolean = $state(false);
	let unlockAnimationLevelNumber: number | null = $state(null);
	let isScrollingAfterNavigation: boolean = $state(false);
	let levelMapImages = [
		{ level: 1, src: '/assets/levelMap/manStudying.png' },
		{ level: 2, src: '/assets/levelMap/manDrinking.png' },
		{ level: 4, src: '/assets/levelMap/manDoctor.png' },
		{ level: 7, src: '/assets/levelMap/womanLearning.png' },
		{ level: 8, src: '/assets/levelMap/peopleSigning.png' }
	];

	const levelsWithProgress = $derived(
		levels.map((level, index) => {
			const levelKey = `level${index + 1}` as keyof GameProgressType['levels'];
			const progress = gameProgress?.levels[levelKey];

			return {
				...level,
				stars: progress?.stars ?? level.stars,
				locked: progress?.locked ?? level.locked
			};
		})
	);

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

	afterNavigate(() => {
		if ($lastPlayedStore.level) {
			const index = $lastPlayedStore.level - 1;
			isScrollingAfterNavigation = true;

			setTimeout(() => {
				const levelButton = document.getElementById(`level-${$lastPlayedStore.level}`);
				if (levelButton) {
					levelButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
					// Wait for scroll to complete, then allow animations to trigger
					setTimeout(() => {
						currentViewedLevelIndex = index;
						isScrollingAfterNavigation = false;
					}, 800);
				}
			}, 200);
		} else {
			window.scrollTo(0, 0);
		}
	});

	$effect(() => {
		if (levelButtonRefs.length === 0) return;

		// Check initially visible level (for level 1 at page load)
		const firstVisibleIndex = levelButtonRefs.findIndex((ref) => {
			if (!ref) return false;
			const rect = ref.getBoundingClientRect();
			return rect.top >= 0 && rect.top <= window.innerHeight;
		});

		if (firstVisibleIndex !== -1 && currentViewedLevelIndex === null) {
			currentViewedLevelIndex = firstVisibleIndex;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					// Skip observer updates while scrolling after navigation
					if (isScrollingAfterNavigation) return;

					if (entry.isIntersecting) {
						const index = levelButtonRefs.findIndex((ref) => ref === entry.target);
						if (index !== -1) {
							currentViewedLevelIndex = index;
						}
					}
				});
			},
			{ threshold: 0.5 }
		);

		levelButtonRefs.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			observer.disconnect();
		};
	});

	// Check for first 3 stars animation when user views the specific level
	$effect(() => {
		if (currentViewedLevelIndex !== null && $lastPlayedStore.firstThreeStars) {
			const levelNumber = currentViewedLevelIndex + 1;
			const isLastPlayed = levelNumber === $lastPlayedStore.level;
			const matchesFirstThreeStars = levelNumber === $lastPlayedStore.firstThreeStars;

			// Yellow animation: when level is last played and first time getting 3 stars
			if (isLastPlayed && matchesFirstThreeStars) {
				shouldPlayYellowAnimation = true;
				yellowAnimationLevelNumber = levelNumber;
				isYellowAnimationPlaying = true;
				setTimeout(() => {
					isYellowAnimationPlaying = false;
				}, 2000);
			} else {
				shouldPlayYellowAnimation = false;
				yellowAnimationLevelNumber = null;
			}
		}
	});

	// Check for unlock animation independently of which level is viewed
	$effect(() => {
		if ($lastPlayedStore.justUnlockedLevel && !isYellowAnimationPlaying) {
			shouldPlayUnlockAnimation = true;
			unlockAnimationLevelNumber = $lastPlayedStore.justUnlockedLevel;
		} else {
			shouldPlayUnlockAnimation = false;
			unlockAnimationLevelNumber = null;
		}
	});
</script>

<svelte:head>
	<title>Úrovně | Deafio</title>
</svelte:head>

<div class="relative min-h-screen">
	<Particles className="fixed inset-0" />
	<div class="relative flex min-h-screen flex-col items-center gap-50 overflow-x-hidden p-10">
		{#each levelsWithProgress as { icon, stars, locked, description, trails, href }, index}
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
					playYellowAnimation={shouldPlayYellowAnimation &&
						index + 1 === yellowAnimationLevelNumber}
					playUnlockAnimation={shouldPlayUnlockAnimation &&
						index + 1 === unlockAnimationLevelNumber}
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
</div>
<div class="fixed top-1/2 right-4 hidden -translate-y-1/2 transform flex-col gap-2 md:flex">
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollToTop}><ArrowUp /></Button>
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollUpClosest}><ChevronUp /></Button>
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollDownClosest}><ChevronDown /></Button>
	<Button class="cursor-pointer" size="icon-lg" onclick={scrollToBottom}><ArrowDown /></Button>
</div>
