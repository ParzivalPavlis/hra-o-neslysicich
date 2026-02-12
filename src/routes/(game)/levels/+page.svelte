<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import LevelButton from '$components/LevelButton.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { levels } from '$lib/levels';
	import { ArrowUp, ArrowDown, ChevronUp, ChevronDown } from '@lucide/svelte';

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

	function scrollUpClosest() {
		const currentY = window.scrollY + window.innerHeight / 2;
		const visibleButtons = levelButtonRefs
			.filter((ref) => ref && ref.offsetTop + ref.offsetHeight / 2 < currentY - 100)
			.sort((a, b) => b.offsetTop - a.offsetTop);

		if (visibleButtons[0]) {
			visibleButtons[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	function scrollDownClosest() {
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
	{#each levels as { icon, stars, locked, description, trails }, index}
		<div bind:this={levelButtonRefs[index]}>
			<LevelButton level={index + 1} {icon} {stars} {locked} {description} {trails} />
		</div>
	{/each}
</div>
<div class="fixed top-1/2 right-4 flex -translate-y-1/2 transform flex-col gap-2">
	<Button class="cursor-pointer" onclick={scrollToTop}><ArrowUp /></Button>
	<Button class="cursor-pointer" onclick={scrollUpClosest}><ChevronUp /></Button>
	<Button class="cursor-pointer" onclick={scrollDownClosest}><ChevronDown /></Button>
	<Button class="cursor-pointer" onclick={scrollToBottom}><ArrowDown /></Button>
</div>
