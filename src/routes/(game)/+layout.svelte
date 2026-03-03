<script lang="ts">
	import { Menu, Play, X } from '@lucide/svelte';
	import { page } from '$app/state';
	import { levels } from '$lib/levels';
	import { onMount } from 'svelte';
	import Button from '$components/ui/button/button.svelte';
	import { fly } from 'svelte/transition';

	let { children } = $props();

	let levelNumber: number | null = $state(null);
	let isMobile = $state(false);
	let menuOpen = $state(false);

	let currentLevel = $derived.by(() => {
		return levelNumber !== null && levels[levelNumber - 1] ? levels[levelNumber - 1] : null;
	});

	// Pages that should be landscape-only
	const landscapeOnlyPages = ['/levels/4'];

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

		// Reset menu when navigating
		menuOpen = false;
	});
</script>

<svelte:window on:resize={checkIsMobile} />
<div class="relative">
	{@render children()}
	<!-- Regular menu for non-landscape pages OR desktop -->
	{#if !isLandscapePage || !isMobile}
		<nav class="fixed right-0 bottom-0 left-0 z-100 h-13 bg-foreground">
			<ul class="flex h-full items-end justify-around">
				<li>
					<a class="flex w-20 flex-col items-center" href="/">
						{#if page.url.pathname === '/'}
							<div
								class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded bg-white"
							>
								<Menu class="-rotate-45 transform" />
							</div>
						{:else}
							<Menu color="white" />
						{/if}
						<span class="text-white">Domů</span>
					</a>
				</li>
				<li>
					<a class="flex w-20 flex-col items-center" href="/levels">
						{#if page.url.pathname === '/levels'}
							<div
								class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded bg-white"
							>
								<Play fill="white" class="-rotate-45 transform" />
							</div>
						{:else}
							<Play fill="white" color="white" />
						{/if}
						<span class="text-white">Úrovně</span>
					</a>
				</li>
				{#if currentLevel}
					<li>
						<div class="flex w-20 flex-col items-center">
							<div
								class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded bg-white"
							>
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component this={currentLevel.icon} class="-rotate-45 transform" />
							</div>
							<span class="text-white">Úroveň {levelNumber}</span>
						</div>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}

	<!-- Mobile landscape menu for landscape-only pages -->
	{#if isLandscapePage && isMobile}
		<Button
			onclick={() => (menuOpen = !menuOpen)}
			class="fixed top-4 right-4 z-50 flex items-center justify-center border-2 border-foreground bg-white"
		>
			{#if menuOpen}
				<X color="black" size={32} />
			{:else}
				<Menu color="black" size={32} />
			{/if}
		</Button>
		{#if menuOpen}
			<div
				class="animate-fade-in fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
				onclick={() => (menuOpen = false)}
				role="presentation"
			></div>
			<nav class="animate-dropdown fixed top-[calc(1rem+2.5rem+5px)] right-4 z-50">
				<div
					class="relative rounded-lg border-2 border-foreground bg-white px-6 py-3 font-semibold"
				>
					<ul class="flex flex-col items-start gap-6">
						<li in:fly={{ x: 20, duration: 400, delay: 0 }}>
							<a
								class="flex items-center gap-3 text-black"
								href="/"
								onclick={() => (menuOpen = false)}
							>
								<Menu size={24} />
								<span>Domů</span>
							</a>
						</li>
						<li in:fly={{ x: 20, duration: 400, delay: 80 }}>
							<a
								class="flex items-center gap-3 text-black"
								href="/levels"
								onclick={() => (menuOpen = false)}
							>
								<Play fill="white" size={24} />
								<span>Úrovně</span>
							</a>
						</li>
						<li
							in:fly={{ x: 20, duration: 400, delay: 160 }}
							class={currentLevel && page.url.pathname.includes('/levels/' + levelNumber)
								? 'flex min-h-7.5 items-center gap-3 border-b-2 border-black text-white'
								: ''}
							style={currentLevel ? '' : 'display: none;'}
						>
							<div class="flex items-center gap-3 text-black">
								<!-- svelte-ignore svelte_component_deprecated -->
								{#if currentLevel}
									<svelte:component this={currentLevel.icon} size={24} />
									<span>Úroveň {levelNumber}</span>
								{/if}
							</div>
						</li>
					</ul>
				</div>
			</nav>
		{/if}
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes dropdown {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	:global(.animate-fade-in) {
		animation: fadeIn 0.2s ease-out;
	}

	:global(.animate-dropdown) {
		animation: dropdown 0.3s ease-out;
	}
</style>
