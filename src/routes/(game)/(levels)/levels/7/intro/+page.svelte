<script lang="ts">
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import ReplayButton from '$components/tutorials/ReplayButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let fadeAnimations = $state(false);
	let introState = $state<1 | 2 | 3>(1);

	function handleContinue() {
		if (introState === 1) {
			introState = 2;
		} else if (introState === 2) {
			introState = 3;
		} else {
			goto('/levels/7/game');
		}
	}

	function handleLearn() {
		goto('/levels/7/learn');
	}

	onMount(() => {
		setLastPlayed(7);
		fadeAnimations = true;
	});
</script>

<svelte:head>
	<title>Úroveň 7 | Deafio</title>
</svelte:head>

<Layout1>
	<div class="flex w-full max-w-150 flex-col items-center text-justify">
		{#if introState === 1 && fadeAnimations}
			<div in:fade={{ duration: 3000 }}>
				<Paragraph>
					Znaková řeč je pro neslyšící lidi přirozeným způsobem komunikace a hraje v jejich
					každodenním životě klíčovou roli.
				</Paragraph>
			</div>
			<div in:fade={{ delay: 3000, duration: 3000 }}>
				<Paragraph className="mt-5">
					Díky znakové řeči mohou neslyšící lidé sdílet informace, vyjadřovat emoce a plnohodnotně
					komunikovat s ostatními. Zároveň jim umožňuje lépe porozumět světu kolem sebe a aktivně se
					zapojit do běžných situací, které jsou pro slyšící samozřejmé.
				</Paragraph>
			</div>
			<div class="w-full" in:fade={{ delay: 6000, duration: 3000 }}>
				<GameButton onclick={handleContinue} class="mt-5 w-full">Pokračovat</GameButton>
			</div>
		{/if}
		{#if introState === 2}
			<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
			<Paragraph>
				Tato úrověn je rozdělena na dvě části. V první části se naučíte několik základních znaků
				znakového jazyka a ve druhé části bude vaším cílem porozumět konverzacím mezi neslyšícími.
			</Paragraph>
			<ReplayButton />
			<GameButton class="mt-5 w-full max-w-[80%] md:max-w-150" onclick={handleContinue}>
				Pokračovat
			</GameButton>
		{/if}
		{#if introState === 3}
			<div class="flex w-full flex-col items-center gap-3">
				<Paragraph variant={3} className="text-center">Začít se učit znakový jazyk:</Paragraph>
				<GameButton class="w-full max-w-[80%] md:max-w-150" onclick={handleLearn}>
					Učit se
				</GameButton>
			</div>
			<div class="mt-10 flex w-full flex-col items-center gap-3">
				<Paragraph variant={3} className="text-center">Přejít rovnou na konverzace:</Paragraph>
				<GameButton class="w-full max-w-[80%] md:max-w-150" onclick={handleContinue}>
					Konverzace
				</GameButton>
			</div>
		{/if}
	</div>
</Layout1>
