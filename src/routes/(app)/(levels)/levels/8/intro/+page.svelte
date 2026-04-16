<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const CURRENT_LEVEL_NUMBER = 8;

	let fadeAnimations = $state(false);

	function handleContinue() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/tutorial`);
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
		{#if fadeAnimations}
			<Paragraph inTransition={{ duration: 3000 }}>
				Představte si konverzaci, ve které neuslyšíte ani jediné slovo. Místo hlasu, intonace a
				zvuků probíhá vše pouze pomocí pohybů rukou, mimiky a výrazů tváře.
			</Paragraph>
			<Paragraph inTransition={{ delay: 3000, duration: 3000 }}>
				Pro neslyšící je to přirozený způsob komunikace. Znaková řeč nahrazuje mluvené slovo a
				umožňuje sdílet myšlenky, emoce i informace bez jediného zvuku. Každé gesto má svůj význam a
				stejně důležité jsou i detaily jako tempo nebo výraz obličeje.
			</Paragraph>
			<div class="w-full" in:fade={{ delay: 6000, duration: 3000 }}>
				<GameButton onclick={handleContinue} class="w-full">Pokračovat</GameButton>
			</div>
		{/if}
	</div>
</Layout1>
