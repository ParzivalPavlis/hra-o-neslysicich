<script lang="ts">
	import { fade } from 'svelte/transition';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';
	import ReplayButtonTutorial from '$components/tutorials/ReplayButton.svelte';
	import LivesTutorial from '$components/tutorials/Lives.svelte';
	import AlertButtonTutorial from '$components/tutorials/AlertButton.svelte';

	const CURRENT_LEVEL_NUMBER = 5;

	let fadeAnimations = $state(false);
	let introState = $state<1 | 2>(1);

	function handleContinue() {
		if (introState === 1) {
			introState = 2;
		} else {
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
	<div class="flex w-full max-w-150 flex-col gap-3 text-justify">
		{#if introState === 1 && fadeAnimations}
			<Paragraph inTransition={{ duration: 3000 }}
				>Navštívili jste banku, kde si chcete zařídit několik věcí:</Paragraph
			>
			<div in:fade={{ delay: 3000, duration: 3000 }}>
				<ul class="mx-auto list-disc pl-5 text-[15px] md:text-[17px]">
					<li class="font-bold">založit si spořicí účet</li>
					<li class="font-bold">uložit na něj 50 000 Kč</li>
					<li class="font-bold">zjistit informace o úrokové sazbě</li>
					<li class="font-bold">nastavit si internetové bankovnictví</li>
				</ul>
			</div>
			<div in:fade={{ delay: 6000, duration: 3000 }}>
				<Paragraph>
					Nemáte žádný úvěr ani dluhy a jedná se o vaši první návštěvu této banky. Nemáte zájém o
					investice a žádné podoné služby.
				</Paragraph>
				<Paragraph>
					Pracovník banky ví, že jste neslyšící, ale zdá se, že úplně neví, jak s vámi komunikovat.
				</Paragraph>
			</div>
			<Paragraph inTransition={{ delay: 9000, duration: 3000 }}>
				Vaším cílem je správně odpovídat na jeho otázky. Občas nebudete rozumět, bude si zakrývat
				ústa, nebo vám nebude dávat oční kontakt.
			</Paragraph>
			<div class="w-full" in:fade={{ delay: 12000, duration: 3000 }}>
				<GameButton onclick={handleContinue} class="w-full">Pokračovat</GameButton>
			</div>
		{/if}
		{#if introState === 2}
			<Paragraph variant={3} className="text-center font-bold">Vystvětlivky:</Paragraph>
			<Paragraph>
				V této úrovni budete sledovat videa, která simulují návštěvu banky, ale bez zvuku. Budete
				muset pracovníkovy odezírat z úst.
			</Paragraph>
			<AlertButtonTutorial />
			<ReplayButtonTutorial />
			<LivesTutorial />
			<GameButton onclick={handleContinue} class="w-full">Začít</GameButton>
		{/if}
	</div>
</Layout1>
