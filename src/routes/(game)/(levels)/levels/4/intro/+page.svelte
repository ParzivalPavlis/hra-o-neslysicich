<script lang="ts">
	import { fade } from 'svelte/transition';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';

	let fadeAnimations = $state(false);

	function handleContinue() {
		goto('/levels/4/game');
	}

	onMount(() => {
		setLastPlayed(4);
		fadeAnimations = true;
	});
</script>

<svelte:head>
	<title>Úroveň 4 | Deafio</title>
</svelte:head>

<Layout1>
	{#if fadeAnimations}
		<div class="flex w-full max-w-150 flex-col gap-3 text-justify">
			<div in:fade={{ duration: 3000 }}>
				<Paragraph>
					Necítíte se dobře a rozhodl/a jste se navštívit praktického lékaře. Poslední dny máte tyto
					potíže:
				</Paragraph>
			</div>
			<div in:fade={{ delay: 3000, duration: 3000 }}>
				<ul class="mx-auto list-disc pl-5 text-[15px] md:text-[17px]">
					<li class="font-bold">bolest v krku</li>
					<li class="font-bold">teplotu 38 °C</li>
					<li class="font-bold">lehký kašel</li>
					<li class="font-bold">potíže trvají 3 dny</li>
				</ul>
			</div>
			<div in:fade={{ delay: 6000, duration: 3000 }}>
				<Paragraph>
					Další důležitá informace: <span class="font-bold">nejste na nic alegický/á</span>
				</Paragraph>
			</div>
			<div in:fade={{ delay: 9000, duration: 3000 }}>
				<Paragraph>
					Vaším cílem je správně odpovídat na jeho otázky, vysvětlit mu své potíže a nakonec získat
					správnou diagnózu a doporučení.
				</Paragraph>
			</div>
		</div>
		<div transition:fade={{ delay: 12000, duration: 3000 }}>
			<GameButton onclick={handleContinue} class="mt-5">Pokračovat</GameButton>
		</div>
	{/if}
</Layout1>
