<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$components/ui/button';
	import LevelTrail from '$components/LevelTrail.svelte';
	import { Speech, Star } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { LevelButtonType } from '$types/levelButton';

	let { level, stars, locked, description, trails }: LevelButtonType = $props();

	let clickCount = $state(0);
	let containerRef: HTMLDivElement;

	function handleClick() {
		clickCount++;
		if (clickCount === 2) {
			goto(`/levels/${level}`);
		}
	}

	function handleDocumentClick(e: MouseEvent) {
		if (clickCount === 1 && containerRef && !containerRef.contains(e.target as Node)) {
			clickCount = 0;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleDocumentClick);
		return () => document.removeEventListener('click', handleDocumentClick);
	});
</script>

<div class="relative flex h-80 w-full max-w-50 flex-col items-center" bind:this={containerRef}>
	{#if trails}
		<LevelTrail variant={trails} />
	{/if}
	<Button
		type="button"
		disabled={locked}
		onclick={handleClick}
		class="group relative flex h-40 w-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-white/10
          shadow-lg
         transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0
         disabled:opacity-50 disabled:hover:translate-y-0"
	>
		<div class="flex flex-col items-center gap-2">
			<div class="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
				<Speech color="white" />
			</div>
			<div class="text-lg font-extrabold text-white uppercase drop-shadow">Úroveň {level}</div>
			<div class="flex gap-1">
				{#each Array(3) as _, i}
					<Star
						class={'h-4 w-4 ' + (i < stars ? 'fill-yellow-300 text-yellow-300' : 'text-white/35')}
					/>
				{/each}
			</div>
		</div>
	</Button>
	{#if clickCount === 1}
		<div class="chat-bubble mt-2 max-w-xs rounded-lg border border-foreground bg-white px-4 py-3">
			<p class="text-sm leading-relaxed text-foreground">{description}</p>
		</div>
	{/if}
</div>

<style>
	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.chat-bubble {
		animation: slideInUp 0.4s ease-out;
	}
</style>
