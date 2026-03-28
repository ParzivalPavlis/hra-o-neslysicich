<script lang="ts">
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import TalkingPersonTutorial from '$components/tutorials/TalkingPerson.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';

	let introState = $state<1 | 2>(1);

	function handleContinue() {
		if (introState === 1) {
			introState = 2;
		} else if (introState === 2) {
			goto('/levels/2');
		}
	}

	onMount(() => {
		setLastPlayed(2);
	});
</script>

<svelte:head>
	<title>Úroveň 2 | Deafio</title>
</svelte:head>

<Layout1>
	<div class="flex w-full max-w-150 flex-col items-center text-justify">
		{#if introState === 1}
			<Paragraph>
				Nacházíte se v roli neslyšícího člověka v kavárně. Okolo sebe máte další návštěvníky, kteří
				si povídají a jelikož čekáte na kamaráda, nenapadne vás nic lepšího než mezitím zjistit, o
				čem si ostatní povídají. Na konci je vaším cílem odpovědět na sérii otázek vztahující se k
				tématům, o kterých si postavy povídaly.
			</Paragraph>
			<GameButton onclick={handleContinue} class="mt-5 w-full">Pokračovat</GameButton>
		{/if}
		{#if introState === 2}
			<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
			<TalkingPersonTutorial />
			<GameButton class="w-full max-w-[80%] md:max-w-150" onclick={handleContinue}>
				Začít
			</GameButton>
		{/if}
	</div>
</Layout1>
