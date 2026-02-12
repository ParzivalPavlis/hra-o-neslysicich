<script lang="ts">
	import { Menu, Play } from '@lucide/svelte';
	import { page } from '$app/state';
	import { levels } from '$lib/levels';

	let { children } = $props();

	let levelNumber: number | null = $state(null);
	let currentLevel = $derived.by(() => {
		return levelNumber !== null && levels[levelNumber - 1] ? levels[levelNumber - 1] : null;
	});

	$effect(() => {
		const match = page.url.pathname.match(/\/levels\/(\d+)/);
		levelNumber = match ? parseInt(match[1]) : null;
	});
</script>

<nav class="fixed right-0 bottom-0 left-0 z-100 h-13 bg-foreground">
	<ul class="flex h-full items-end justify-around">
		<li>
			<a class="flex w-20 flex-col items-center" href="/">
				{#if page.url.pathname === '/'}
					<div
						class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded"
						style="background: linear-gradient(to bottom, transparent 50%, white 50%)"
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
						class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded"
						style="background: linear-gradient(135deg, transparent 50%, white 50%)"
					>
						<Play class="-rotate-45 transform" />
					</div>
				{:else}
					<Play color="white" />
				{/if}
				<span class="text-white">Úrovně</span>
			</a>
		</li>
		{#if currentLevel}
			<li>
				<div class="flex w-20 flex-col items-center">
					<div
						class="absolute -top-5.25 flex h-10 w-10 rotate-45 transform items-center justify-center rounded"
						style="background: linear-gradient(135deg, transparent 50%, white 50%)"
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
{@render children()}
