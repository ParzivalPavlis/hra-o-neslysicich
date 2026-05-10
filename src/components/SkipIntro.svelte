<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import { goto } from '$app/navigation';

	type Props = {
		levelNumber: number;
		skipTo: 'game' | 'tutorial';
		onContinue?: () => void;
	};

	let { levelNumber, skipTo, onContinue }: Props = $props();

	let showButtons = $state(false);

	$effect(() => {
		const timer = setTimeout(() => (showButtons = true), 200);
		return () => clearTimeout(timer);
	});

	function skipToGame() {
		goto(`/levels/${levelNumber}/${skipTo}`);
	}

	function continueNormally() {
		showButtons = false;
		onContinue?.();
	}
</script>

{#if showButtons}
	<div
		class="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center gap-4"
		onclick={continueNormally}
		role="presentation"
	>
		<div class="flex flex-col gap-10">
			<GameButton onclick={skipToGame}>Přeskočit intro</GameButton>
			<GameButton onclick={continueNormally}>Pokračovat</GameButton>
		</div>
	</div>
{/if}
