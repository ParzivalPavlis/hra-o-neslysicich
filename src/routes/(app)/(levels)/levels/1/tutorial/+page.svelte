<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import TalkingPersonTutorial from '$components/tutorials/TalkingPerson.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { goto } from '$app/navigation';

	const CURRENT_LEVEL_NUMBER = 1;

	function handleContinue() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<Layout1>
	<div class="text-justif flex w-full max-w-150 flex-col items-center gap-3">
		<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
		<Paragraph>
			Nacházíte se v roli neslyšícího člověka ve škole. Čekáte na začátek hodiny a nedaleko od vás
			si dva vaši kamarádi spolu povídají. Protože máte chvíli času, začnete sledovat jejich
			konverzaci a snažíte se odezírat, o čem mluví. Na konci je vaším cílem odpovědět na sérii
			otázek vztahujících se k tématům, o kterých si kamarádi mluvili.
		</Paragraph>
		<TalkingPersonTutorial />
		<GameButton class="w-full md:max-w-150" onclick={handleContinue}>Začít</GameButton>
	</div>
</Layout1>
