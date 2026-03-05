<script lang="ts">
	import { fade } from 'svelte/transition';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';

	let fadeAnimations = $state(false);

	function handleContinue() {
		goto('/levels/4');
	}

	onMount(() => {
		fadeAnimations = true;
	});
</script>

<Layout1>
	{#if fadeAnimations}
		<div class="flex w-full max-w-150 flex-col gap-3">
			<div in:fade={{ duration: 3000 }}>
				<Paragraph className="text-center">
					Necítíte se dobře a rozhodl/a jste se navštívit praktického lékaře. Poslední dny máte tyto
					potíže:
				</Paragraph>
			</div>
			<div in:fade={{ delay: 3000, duration: 3000 }}>
				<ul class="mx-auto text-center text-[14px]">
					<li class="font-bold">bolest v krku</li>
					<li class="font-bold">teplotu 38 °C</li>
					<li class="font-bold">lehký kašel</li>
					<li class="font-bold">potíže trvají 3 dny</li>
				</ul>
			</div>
			<div in:fade={{ delay: 6000, duration: 3000 }}>
				<Paragraph className="text-center">
					Je to pro vás divné, jelikož je sice alergická sezóna ale vy
					<span class="font-bold"> nejste na nic alegický/á </span>.
				</Paragraph>
			</div>
			<div in:fade={{ delay: 9000, duration: 3000 }}>
				<Paragraph className="text-center">
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
