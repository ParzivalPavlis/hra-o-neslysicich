<script lang="ts">
	import { Menu, Play, X } from '@lucide/svelte';
	import { page } from '$app/state';
	import { levels } from '$lib/levels';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { colors } from '$lib/shared/colors';

	let { children } = $props();

	let levelNumber: number | null = $state(null);
	let isMobile = $state(false);
	let mobileMenuOpen = $state(false);

	let currentLevel = $derived.by(() => {
		return levelNumber !== null && levels[levelNumber - 1] ? levels[levelNumber - 1] : null;
	});

	// Pages that should be landscape-only
	const landscapeOnlyPages = ['/levels/4/game'];

	function shouldBeLandscapeOnly(pathname: string): boolean {
		return landscapeOnlyPages.some((p) => pathname.includes(p));
	}

	let isLandscapePage = $derived(shouldBeLandscapeOnly(page.url.pathname));

	function checkIsMobile() {
		const userAgent = navigator.userAgent.toLowerCase();
		isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
	}

	function lockPortraitOrientation() {
		if (screen.orientation && (screen.orientation as any).lock) {
			(screen.orientation as any).lock('portrait').catch(() => {
				console.log('Could not lock orientation to portrait');
			});
		}
	}

	function lockLandscapeOrientation() {
		if (screen.orientation && (screen.orientation as any).lock) {
			(screen.orientation as any).lock('landscape').catch(() => {
				console.log('Could not lock orientation to landscape');
			});
		}
	}

	onMount(() => {
		checkIsMobile();
	});

	$effect(() => {
		const match = page.url.pathname.match(/\/levels\/(\d+)/);
		levelNumber = match ? parseInt(match[1]) : null;

		// By default lock portrait, unlock only for landscape-only pages
		if (shouldBeLandscapeOnly(page.url.pathname)) {
			lockLandscapeOrientation();
		} else {
			lockPortraitOrientation();
		}
	});
</script>

<svelte:window on:resize={checkIsMobile} />
<div class="relative">
	{@render children()}
	{#if !isLandscapePage || !isMobile}
		<nav
			class="fixed right-0 bottom-0 left-0 z-100 mx-auto h-13 border-t-4 border-r-4 border-l-4 border-white {isMobile
				? 'w-[96%]'
				: 'w-[30%]'} rounded-tl-lg rounded-tr-lg bg-secondary"
		>
			<ul class="flex h-full items-end justify-around">
				<li class="flex h-full items-center">
					<a class="flex h-full w-20 flex-col items-center justify-center" href="/">
						{#if page.url.pathname === '/'}
							<div
								class="absolute -top-6.25 flex h-12 w-12 rotate-45 transform items-center justify-center rounded bg-white"
							>
								<Menu size={35} color={colors.secondary} class="-rotate-45 transform" />
							</div>
						{:else}
							<Menu size={35} color="white" />
						{/if}
					</a>
				</li>
				<li class="flex h-full items-center">
					<a class="flex h-full w-20 flex-col items-center justify-center" href="/levels">
						{#if page.url.pathname === '/levels'}
							<div
								class="absolute -top-6.25 flex h-12 w-12 rotate-45 transform items-center justify-center rounded bg-white"
							>
								<Play size={35} color={colors.secondary} class="-rotate-45 transform" />
							</div>
						{:else}
							<Play size={35} fill="white" color="white" />
						{/if}
					</a>
				</li>
				{#if currentLevel}
					<li class="flex h-full items-center">
						<div class="flex h-full w-20 flex-col items-center justify-center">
							<div
								class="absolute -top-6.25 flex h-12 w-12 rotate-45 transform items-center justify-center rounded bg-white"
							>
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component
									this={currentLevel.icon}
									color={colors.secondary}
									size={35}
									class="-rotate-45 transform"
								/>
							</div>
						</div>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
	{#if isLandscapePage && isMobile}
		<nav class="fixed top-0 right-0 bottom-0 z-100 flex">
			<button
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="mt-4 flex h-fit items-center justify-center rounded-tl-lg rounded-bl-lg border-t-2 border-b-2 border-l-2 border-secondary bg-secondary p-1"
			>
				{#if mobileMenuOpen}
					<X size={30} class="text-white transition-transform duration-300" />
				{:else}
					<Menu size={30} class=" text-white transition-transform duration-300" />
				{/if}
			</button>
			{#if mobileMenuOpen}
				<ul
					class="flex h-full w-12 flex-col items-center justify-around bg-secondary"
					transition:fly={{ x: 100, duration: 300 }}
				>
					<li>
						<a class="flex flex-col items-center" href="/">
							{#if page.url.pathname === '/'}
								<div
									class="absolute -left-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded bg-white"
								>
									<Menu size={30} class="-rotate-45 transform" />
								</div>
							{:else}
								<Menu size={30} color="white" />
							{/if}
						</a>
					</li>
					<li>
						<a class="flex flex-col items-center" href="/levels">
							{#if page.url.pathname === '/levels'}
								<div
									class="absolute -left-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded bg-white"
								>
									<Play size={30} fill="white" class="-rotate-45 transform" />
								</div>
							{:else}
								<Play size={30} fill="white" color="white" />
							{/if}
						</a>
					</li>
				</ul>
			{/if}
		</nav>
	{/if}
</div>
