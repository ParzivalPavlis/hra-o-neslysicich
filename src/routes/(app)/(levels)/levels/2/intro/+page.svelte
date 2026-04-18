<script lang="ts">
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import TalkingPersonTutorial from '$components/tutorials/TalkingPerson.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 2;

	function handleContinue() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}

	onMount(() => {
		setLastPlayed(CURRENT_LEVEL_NUMBER);
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<Layout1>
	<div class="text-justif flex w-full max-w-150 flex-col items-center gap-3">
		<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
		<Paragraph>
			Nacházíte se v roli neslyšícího člověka v kavárně. Okolo sebe máte další návštěvníky, kteří si
			povídají a jelikož čekáte na kamaráda, nenapadne vás nic lepšího než mezitím zjistit, o čem si
			ostatní povídají. Na konci je vaším cílem odpovědět na sérii otázek vztahující se k tématům, o
			kterých si postavy povídaly.
		</Paragraph>
		<TalkingPersonTutorial />
		<GameButton class="w-full md:max-w-150" onclick={handleContinue}>Začít</GameButton>
	</div>
</Layout1>
