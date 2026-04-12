<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import ReplayButtonTutorial from '$components/tutorials/ReplayButton.svelte';
	import LivesTutorial from '$components/tutorials/Lives.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const CURRENT_LEVEL_NUMBER = 8;

	let fadeAnimations = $state(false);
	let introState = $state<1 | 2 | 3>(1);

	function handleContinue() {
		if (introState === 1) {
			introState = 2;
		} else if (introState === 2) {
			goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
		}
	}

	onMount(() => {
		setLastPlayed(CURRENT_LEVEL_NUMBER);
		fadeAnimations = true;
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<Layout1>
	<div class="flex w-full max-w-150 flex-col items-center gap-3 text-justify">
		{#if introState === 1 && fadeAnimations}
			<Paragraph inTransition={{ duration: 3000 }}>
				Představte si konverzaci, ve které neuslyšíte ani jediné slovo. Místo hlasu, intonace a
				zvuků probíhá vše pouze pomocí pohybů rukou, mimiky a výrazů tváře.
			</Paragraph>
			<Paragraph inTransition={{ delay: 3000, duration: 3000 }}>
				Pro neslyšící je to přirozený způsob komunikace. Znaková řeč nahrazuje mluvené slovo a
				umožňuje sdílet myšlenky, emoce i informace bez jediného zvuku. Každé gesto má svůj
				významand stejně důležité jsou i detaily jako tempo nebo výraz obličeje.
			</Paragraph>
			<div class="w-full" in:fade={{ delay: 6000, duration: 3000 }}>
				<GameButton onclick={handleContinue} class="w-full">Pokračovat</GameButton>
			</div>
		{/if}
		{#if introState === 2}
			<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
			<Paragraph>
				V této úrovni musíte uhodnout, o čem si neslyšící postavy povídají. Konverzace obsahují
				znaky z úrovně 7.
			</Paragraph>
			<ReplayButtonTutorial />
			<LivesTutorial />
			<GameButton class="w-full md:max-w-150" onclick={handleContinue}>Začít</GameButton>
		{/if}
	</div>
</Layout1>
