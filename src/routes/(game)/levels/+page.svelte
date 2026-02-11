<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import LevelButton from '$components/LevelButton.svelte';
	import Button from '$components/ui/button/button.svelte';
	import type { LevelButtonType } from '$lib/types/levelButton';
	import { ArrowUp, ArrowDown, ChevronUp, ChevronDown } from '@lucide/svelte';

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

	let levelButtonRefs: HTMLDivElement[] = [];

	afterNavigate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function scrollToBottom() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	function scrollUp25() {
		const currentY = window.scrollY + window.innerHeight / 2;
		const visibleButtons = levelButtonRefs
			.filter((ref) => ref && ref.offsetTop + ref.offsetHeight / 2 < currentY - 100)
			.sort((a, b) => b.offsetTop - a.offsetTop);

		if (visibleButtons[0]) {
			visibleButtons[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function scrollDown25() {
		const currentY = window.scrollY + window.innerHeight / 2;
		const visibleButtons = levelButtonRefs
			.filter((ref) => ref && ref.offsetTop > currentY + 100)
			.sort((a, b) => a.offsetTop - b.offsetTop);

		if (visibleButtons[0]) {
			visibleButtons[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
</script>

<div class="relative flex min-h-screen flex-col-reverse items-center gap-50 p-10">
	{#each levels as { stars, locked, description, trails }, index}
		<div bind:this={levelButtonRefs[index]}>
			<LevelButton level={index + 1} {stars} {locked} {description} {trails} />
		</div>
	{/each}
</div>
<div class="fixed top-1/2 right-4 flex -translate-y-1/2 transform flex-col gap-2">
	<Button class="cursor-pointer" onclick={scrollToTop}><ArrowUp /></Button>
	<Button class="cursor-pointer" onclick={scrollUp25}><ChevronUp /></Button>
	<Button class="cursor-pointer" onclick={scrollDown25}><ChevronDown /></Button>
	<Button class="cursor-pointer" onclick={scrollToBottom}><ArrowDown /></Button>
</div>
