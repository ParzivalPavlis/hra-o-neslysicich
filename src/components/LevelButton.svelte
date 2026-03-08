<script lang="ts">
	import { Button } from '$components/ui/button';
	import LevelTrail from '$components/LevelTrail.svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { Lock } from '@lucide/svelte';
	import type { ButtonVariantType, LevelButtonType } from '$types/levelButton';

	let { attributes }: { attributes: LevelButtonType } = $props();

	let clickCount = $state(0);
	// svelte-ignore state_referenced_locally
	let IconComponent = attributes.icon;

	const variantClasses: Record<ButtonVariantType, string> = {
		blue: 'hover:bg-blue-500 bg-blue-500 shadow-[0_8px_0_rgb(29,78,216)] hover:shadow-[0_10px_0_rgb(29,78,216)] active:shadow-[0_4px_0_rgb(29,78,216)]',
		gray: 'hover:bg-gray-500 bg-gray-500 shadow-[0_8px_0_rgb(55,65,81)] hover:shadow-[0_10px_0_rgb(55,65,81)] active:shadow-[0_4px_0_rgb(55,65,81)]',
		green:
			'hover:bg-green-500 bg-green-500 shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_10px_0_rgb(21,128,61)] active:shadow-[0_4px_0_rgb(21,128,61)]',
		yellow:
			'hover:bg-yellow-500 bg-yellow-500 shadow-[0_8px_0_rgb(234,179,8)] hover:shadow-[0_10px_0_rgb(234,179,8)] active:shadow-[0_4px_0_rgb(234,179,8)]'
	};

	const variant = $derived(
		attributes.locked
			? 'gray'
			: attributes.stars === 3
				? 'yellow'
				: attributes.stars > 0
					? 'green'
					: 'blue'
	);

	function handleClick(e: MouseEvent, node: HTMLElement) {
		if (clickCount === 1 && !node.contains(e.target as Node)) {
			clickCount = 0;
		}
	}

	function clickOutside(node: HTMLElement) {
		document.addEventListener('click', (e) => handleClick(e, node));
		return {
			destroy() {
				document.removeEventListener('click', (e) => handleClick(e, node));
			}
		};
	}
</script>

<div class="relative z-20 flex h-96 w-full max-w-64 flex-col items-center" use:clickOutside>
	<Button
		type="button"
		disabled={attributes.locked}
		onclick={() => {
			clickCount++;
			if (clickCount === 2) {
				goto(attributes.href);
			}
		}}
		class={cn(
			'group relative flex h-52 w-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full transition-all hover:-translate-y-0.5 hover:opacity-100 active:translate-y-1',
			variantClasses[variant]
		)}
	>
		<div class="flex flex-col items-center gap-2">
			<div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white">
				{#if attributes.locked}
					<Lock class="h-7 w-7" />
				{:else}
					<IconComponent class="h-7 w-7" />
				{/if}
			</div>
			<div class="text-2xl font-extrabold text-white uppercase drop-shadow">
				Úroveň {attributes.level}
			</div>
		</div>
	</Button>
	{#if clickCount === 1}
		<div
			class="chat-bubble mt-4 max-w-xs rounded-lg border border-foreground bg-white px-4 py-3"
			style="z-index: inherit;"
		>
			<p class="text-center text-sm leading-relaxed text-foreground">{attributes.description}</p>
		</div>
	{/if}
	{#if attributes.trails}
		<LevelTrail variant={attributes.trails} />
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
