<script lang="ts">
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';
	import GameButton from '$components/GameButton.svelte';

	const CURRENT_LEVEL_NUMBER = 7;

	function handleContinue() {
		goto(`/levels/${CURRENT_LEVEL_NUMBER}/game`);
	}

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
	});
</script>

<Layout1>
	<div class="text-justif flex w-full max-w-150 flex-col items-center gap-3">
		<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
		<Paragraph>Text pro tutorial</Paragraph>
		<GameButton class="w-full md:max-w-150" onclick={handleContinue}>Začít</GameButton>
	</div>
</Layout1>
