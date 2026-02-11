<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import LevelButton from '$components/LevelButton.svelte';
	import type { LevelButtonType } from '$lib/types/levelButton';

	const levels: LevelButtonType[] = [
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění adad ad aaddada adda a d',
			trails: 3
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění',
			trails: 5
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění',
			trails: 2
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění',
			trails: 4
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění',
			trails: 1
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění',
			trails: 6
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění',
			trails: 3
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění',
			trails: 5
		},
		{
			stars: 0,
			locked: false,
			description: 'Kliknutím znovu pro spuštění'
		}
	];

	afterNavigate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});
</script>

<div class="flex min-h-screen flex-col-reverse items-center gap-50 p-10">
	{#each levels as { stars, locked, description, trails }, index}
		<LevelButton level={index + 1} {stars} {locked} {description} {trails} />
	{/each}
</div>
