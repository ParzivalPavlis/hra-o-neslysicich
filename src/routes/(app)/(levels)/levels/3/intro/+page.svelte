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
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const CURRENT_LEVEL_NUMBER = 3;

	let loadAnimation = $state(false);
	let animate = $state(true);
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
		loadAnimation = true;
		animate = data.alreadyPlayed ? false : true;
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<Layout1>
	<div class="flex w-full max-w-150 flex-col gap-3 text-justify">
		{#if introState === 1 && loadAnimation}
			<Paragraph inTransition={animate ? { duration: 3000 } : undefined}>
				Jaké by to bylo navštívít lékaře, kdybychom neslyšeli jeho hlas? Jak bychom mu vysvětlili
				své potíže a porozuměli jeho radám? V této úrovni se ponoříte přesně do takové situace.
			</Paragraph>
			<Paragraph inTransition={animate ? { delay: 3000, duration: 3000 } : undefined}>
				Necítíte se dobře a rozhodl/a jste se navštívit praktického lékaře. Poslední dny máte tyto
				potíže:
			</Paragraph>
			<div in:fade={animate ? { delay: 6000, duration: 3000 } : undefined}>
				<ul class="mx-auto list-disc pl-5 text-[15px] md:text-[17px]">
					<li class="font-bold">bolest v krku</li>
					<li class="font-bold">teplotu 38 °C</li>
					<li class="font-bold">lehký kašel</li>
					<li class="font-bold">potíže trvají 3 dny</li>
				</ul>
			</div>
			<Paragraph inTransition={animate ? { delay: 6000, duration: 3000 } : undefined}>
				Další důležitá informace: <span class="font-bold">nejste na nic alegický/á</span>
			</Paragraph>
			<Paragraph inTransition={animate ? { delay: 9000, duration: 3000 } : undefined}>
				Vaším cílem je správně odpovídat na jeho otázky, vysvětlit mu své potíže a nakonec získat
				správnou diagnózu a doporučení.
			</Paragraph>
			<div class="w-full" in:fade={animate ? { delay: 12000, duration: 3000 } : undefined}>
				<GameButton onclick={handleContinue} class="w-full">Pokračovat</GameButton>
			</div>
		{/if}
		{#if introState === 2}
			<Paragraph variant={3} className="text-center font-bold">Vystvětlivky:</Paragraph>
			<Paragraph>
				V této úrovni budete sledovat videa, která simulují návštěvu lékaře, ale bez zvuku. Budete
				muset doktorovi odezírat z úst.
			</Paragraph>
			<ReplayButtonTutorial />
			<LivesTutorial />
			<GameButton onclick={handleContinue} class="w-full">Začít</GameButton>
		{/if}
	</div>
</Layout1>
