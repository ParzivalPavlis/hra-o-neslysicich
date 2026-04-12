<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const CURRENT_LEVEL_NUMBER = 7;

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
	<div class="text-justif flex w-full max-w-150 flex-col items-center gap-3">
		{#if fadeAnimations}
			<Paragraph inTransition={{ duration: 3000 }}>
				Znaková řeč je pro neslyšící lidi přirozeným způsobem komunikace a hraje v jejich každy den
				ním životě klíčovou roli.
			</Paragraph>
			<Paragraph inTransition={{ delay: 3000, duration: 3000 }}>
				Díky znakové řeči mohou neslyšící lidé sdílet informace, vyjadřovat emoce a plnohodnotně
				komunikovat s ostatními. Zároveň jim umožňuje lépe porozumět světu kolem sebe a aktivně se
				zapojit do běžných situací, které jsou pro slyšící samozřejmé.
			</Paragraph>
			<div class="w-full" in:fade={{ delay: 6000, duration: 3000 }}>
				<GameButton onclick={handleContinue} class="mt-5 w-full">Pokračovat</GameButton>
			</div>
		{/if}
	</div>
</Layout1>
