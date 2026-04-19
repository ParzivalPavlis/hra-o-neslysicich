<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';
	import { level9 } from '$lib/stores/gameState';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import SkipIntro from '$components/SkipIntro.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const CURRENT_LEVEL_NUMBER = 9;

	let fadeAnimations = $state(false);
	let alreadyPlayed = $derived(data.alreadyPlayed);
	let showIntroContent = $state(false);

	function handleContinue() {
		level9.clearPosition();
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}

	onMount(() => {
		setLastPlayed(CURRENT_LEVEL_NUMBER);
		fadeAnimations = true;
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

{#if alreadyPlayed}
	<SkipIntro
		skipTo="game"
		levelNumber={CURRENT_LEVEL_NUMBER}
		onContinue={() => {
			fadeAnimations = false;
			showIntroContent = true;
			setTimeout(() => {
				fadeAnimations = true;
			}, 50);
		}}
	/>
{/if}
{#if !alreadyPlayed || showIntroContent}
	<Layout1>
		<div class="flex w-full max-w-150 flex-col items-center gap-3 text-justify">
			{#if fadeAnimations}
				<Paragraph inTransition={{ duration: 3000 }}>
					Každý den řešíme desítky situací – objednáme si kávu, zeptáme se na cestu, zaplatíme v
					obchodě. Pro neslyšící člověka může být každá taková chvíle výzvou.
				</Paragraph>
				<Paragraph inTransition={{ delay: 3000, duration: 3000 }}>
					Tomáš je neslyšící a právě přišel do kavárny. Pomůžete mu prozkoumat, jak je toto místo
					přizpůsobeno pro neslyšící zákazníky? Klikejte na předměty a zjistěte, co vám prozradí.
				</Paragraph>
				<div class="w-full" in:fade={{ delay: 6000, duration: 3000 }}>
					<GameButton onclick={handleContinue} class="w-full">Vstoupit do kavárny</GameButton>
				</div>
			{/if}
		</div>
	</Layout1>
{/if}
