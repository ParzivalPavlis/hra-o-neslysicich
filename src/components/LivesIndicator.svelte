<script lang="ts">
	import { HeartHandshake } from '@lucide/svelte';

	type Props = {
		lives: number;
		size?: number;
		maxLives?: number;
	};

	let { lives = 4, maxLives = 4, size = 30 }: Props = $props();
</script>

<div class="w-fit">
	{#each Array(maxLives) as _, i}
		<HeartHandshake
			{size}
			class="transition-all duration-500 {i < lives ? 'text-red-600' : 'text-gray-300'}"
		/>
	{/each}
</div>
