<script lang="ts">
	import { HeartHandshake } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		lives?: number;
		size?: number;
		maxLives?: number;
		orientation?: 'horizontal' | 'vertical';
	};

	let { lives = 4, maxLives = 4, size = 30, orientation = 'vertical' }: Props = $props();
</script>

<div class={cn('w-fit', orientation === 'vertical' ? 'flex flex-col' : 'flex flex-row gap-1')}>
	{#each Array.from({ length: maxLives }) as _, i (i)}
		<HeartHandshake
			{size}
			class="transition-all duration-500 {i < maxLives - lives ? 'text-gray-300' : 'text-red-600'}"
		/>
	{/each}
</div>
