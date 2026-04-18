<script lang="ts">
	import AlertButton from '$components/AlertButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount } from 'svelte';

	let visible = $state(true);

	onMount(() => {
		const interval = setInterval(() => {
			visible = !visible;
		}, 2000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex w-full flex-col items-center justify-center gap-5">
	<Paragraph>
		Pracovník ale občas nebude dávat oční kontakt, nebo si bude zakrývat ústa, takže nebudete vědět,
		co říká. V těchto situacích se uprostřed obrazovky na náhodném místě objeví tlačítko níže pro
		upozornění pracovníka. Po kliknutí na něj pracovníka upozorníte a přehraje se vám video znovu
		ale pracovníkovi už bude možné odezírat.
	</Paragraph>
	<div class="flex min-h-20 w-full items-center justify-center">
		{#if visible}
			<AlertButton />
		{/if}
	</div>
</div>
