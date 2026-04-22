<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import ReplayButtonTutorial from '$components/tutorials/ReplayButton.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 5;

	function handleContinue() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}

	function handleLearn() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/learn`);
	}

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
	});
</script>

<Layout1>
	<div class="text-justif flex w-full max-w-150 flex-col items-center gap-3">
		<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
		<Paragraph>
			Tato úrověn je rozdělena na dvě části. První část je zaměřena na učení znakového jazyka a
			druhá část je test, kde si vyzkoušíte své znalosti.
		</Paragraph>
		<ReplayButtonTutorial />
		<div class="flex w-full flex-col items-center gap-5">
			<div class="flex w-full flex-col items-center gap-3">
				<Paragraph variant={3} className="text-center">Začít se učit znakový jazyk:</Paragraph>
				<GameButton class="w-full md:max-w-150" onclick={handleLearn}>Učit se</GameButton>
			</div>
			<div class="flex w-full flex-col items-center gap-3">
				<Paragraph variant={3} className="text-center">Přejít rovnou na test:</Paragraph>
				<GameButton class="w-full md:max-w-150" onclick={handleContinue}>
					Testovat znalosti
				</GameButton>
			</div>
		</div>
	</div>
</Layout1>
