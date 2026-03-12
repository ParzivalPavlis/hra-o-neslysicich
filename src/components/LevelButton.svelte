<script lang="ts">
	import { Button } from '$components/ui/button';
	import LevelTrail from '$components/LevelTrail.svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { Lock } from '@lucide/svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import type { ButtonVariantType, LevelButtonType } from '$types/levelButton';

	let { attributes }: { attributes: LevelButtonType } = $props();

	let clickCount = $state(0);
	// svelte-ignore state_referenced_locally
	let IconComponent = attributes.icon;

	const variantClasses: Record<ButtonVariantType, string> = {
		blue: 'hover:bg-secondary bg-secondary shadow-[0_8px_0_var(--secondary-2)] hover:shadow-[0_10px_0_var(--secondary-2)] active:shadow-[0_4px_0_var(--secondary-2)]',
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

	const variantProgressColors = {
		blue: 'rgb(59, 130, 246)',
		gray: 'rgb(107, 114, 128)',
		green: 'rgb(34, 197, 94)',
		yellow: 'rgb(234, 179, 8)'
	};

	const circumference = 2 * Math.PI * 95;
	const strokeDasharray = $derived(`${(attributes.stars / 3) * circumference} ${circumference}`);

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
	{#if !attributes.locked}
		<svg
			class="pointer-events-none absolute -top-4 left-1/2 z-10 h-62 w-62 -translate-x-1/2"
			viewBox="0 0 200 200"
		>
			<circle cx="100" cy="100" r="96" fill="none" stroke="rgb(209, 213, 219)" stroke-width="6" />
			{#if attributes.stars > 0}
				<circle
					cx="100"
					cy="100"
					r="96"
					fill="none"
					stroke="rgb(234, 179, 8)"
					stroke-width="6"
					stroke-dasharray={strokeDasharray}
					stroke-linecap="round"
					class="transition-all duration-300"
					style="transform-origin: 100px 100px; transform: rotate(-90deg);"
				/>
			{/if}
		</svg>
	{/if}
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
			class="chat-bubble border-gray/20 mt-10 w-full rounded-lg border-3 bg-white px-4 py-3"
			style="z-index: inherit;"
		>
			<Paragraph className="text-center leading-relaxed">{attributes.description}</Paragraph>
			<p class="text-center text-sm leading-relaxed text-foreground"></p>
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
