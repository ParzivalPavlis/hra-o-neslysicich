<script lang="ts">
	import GameButton from './GameButton.svelte';

	type GameEvent = {
		title: string;
		emoji: string;
		lines: string[];
		isExit?: boolean;
	};

	type Props = {
		event: GameEvent;
		encounterHref?: string;
		onclose: () => void;
	};

	let { event, encounterHref, onclose }: Props = $props();
</script>

<div
	class="absolute inset-0 z-40 flex cursor-default items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
>
	<div class="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
		<div class="mb-3 text-center text-6xl">{event.emoji}</div>
		<h2 class="mb-4 text-center text-xl font-bold text-gray-800">{event.title}</h2>
		<div class="mb-6 space-y-2">
			{#each event.lines as line}
				<p class="text-sm leading-relaxed text-gray-600">• {line}</p>
			{/each}
		</div>
		<div class="flex flex-col gap-3">
			<GameButton size="small" href={encounterHref}>Pokračovat</GameButton>
			<GameButton size="small" onclick={onclose}>Zpět</GameButton>
		</div>
	</div>
</div>
