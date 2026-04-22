<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import ReplayButtonTutorial from '$components/tutorials/ReplayButton.svelte';
	import LivesTutorial from '$components/tutorials/Lives.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 6;

	function handleContinue() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
	});
</script>

<Layout1>
	<div class="text-justif flex w-full max-w-150 flex-col items-center gap-3">
		<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
		<Paragraph>
			V této úrovni musíte uhodnout, o čem si neslyšící postavy povídají. Konverzace obsahují znaky
			z úrovně {CURRENT_LEVEL_NUMBER - 1}.
		</Paragraph>
		<ReplayButtonTutorial />
		<LivesTutorial />
		<GameButton class="w-full md:max-w-150" onclick={handleContinue}>Začít</GameButton>
	</div>
</Layout1>
