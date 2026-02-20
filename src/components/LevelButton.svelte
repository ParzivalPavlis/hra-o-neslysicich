<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$components/ui/button';
	import LevelTrail from '$components/LevelTrail.svelte';
	import { Star } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { LevelButtonType } from '$types/levelButton';

	let {
		attributes,
		levelInfoOpen = $bindable(false)
	}: { attributes: LevelButtonType; levelInfoOpen?: boolean } = $props();

	let clickCount = $state(0);
	let containerRef: HTMLDivElement;
	// svelte-ignore state_referenced_locally
	let IconComponent = attributes.icon;

	function handleClick() {
		if (levelInfoOpen) {
			// If info is open, navigate directly with single click
			goto(attributes.href);
		} else {
			// Otherwise require 2 clicks
			clickCount++;
			if (clickCount === 2) {
				goto(attributes.href);
			}
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
	{#if attributes.trails}
		<LevelTrail variant={attributes.trails} />
	{/if}
	<Button
		type="button"
		disabled={attributes.locked}
		onclick={handleClick}
		class="group relative flex h-40 w-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full
          bg-blue-500
          shadow-[0_8px_0_rgb(29,78,216)]
          transition-all
          hover:-translate-y-0.5 hover:bg-blue-500
         hover:opacity-100 hover:shadow-[0_10px_0_rgb(29,78,216)]
         active:translate-y-1 active:shadow-[0_4px_0_rgb(29,78,216)]
         disabled:translate-y-0 disabled:bg-gray-500 disabled:opacity-100
				 disabled:shadow-[0_8px_0_rgb(55,65,81)]"
	>
		<div class="flex flex-col items-center gap-2">
			<div class="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
				<IconComponent class="h-5 w-5" />
			</div>
			<div class="text-lg font-extrabold text-white uppercase drop-shadow">
				Úroveň {attributes.level}
			</div>
			<div class="flex gap-1">
				{#each Array(3) as _, i}
					<Star
						class={'h-4 w-4 ' +
							(i < attributes.stars ? 'fill-yellow-300 text-yellow-300' : 'text-white/35')}
					/>
				{/each}
			</div>
		</div>
	</Button>
	{#if clickCount === 1 || levelInfoOpen}
		<div class="chat-bubble mt-4 max-w-xs rounded-lg border border-foreground bg-white px-4 py-3">
			<p class="text-center text-sm leading-relaxed text-foreground">{attributes.description}</p>
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
