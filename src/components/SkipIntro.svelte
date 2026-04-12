<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import { goto } from '$app/navigation';

	type Props = {
		levelNumber: number;
		skipTo: 'game' | 'tutorial';
		onContinue?: () => void;
	};

	let { levelNumber, skipTo, onContinue }: Props = $props();

	let showButtons = $state(true);

	function skipToGame() {
		goto(`/levels/${levelNumber}/${skipTo}`);
	}

	function continueNormally() {
		showButtons = false;
		onContinue?.();
	}
</script>

{#if showButtons}
	<div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center gap-4">
		<div class="flex flex-col gap-10">
			<GameButton class="pointer-events-auto" onclick={skipToGame}>Přeskočit intro</GameButton>
			<GameButton class="pointer-events-auto" onclick={continueNormally}>Pokračovat</GameButton>
		</div>
	</div>
{/if}
