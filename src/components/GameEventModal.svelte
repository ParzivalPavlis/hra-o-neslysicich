<script lang="ts">
	import GameButton from '$components/GameButton.svelte';

	type GameEvent = {
		title: string;
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
	<div
		class="w-full max-w-xs rounded-xl border border-gray-100 bg-white p-3 shadow-2xl lg:max-w-sm lg:rounded-2xl lg:p-6"
	>
		<h2 class="mb-2 text-center text-sm font-bold text-gray-800 lg:mb-4 lg:text-xl">
			{event.title}
		</h2>
		<div class="mb-3 space-y-1 lg:mb-6 lg:space-y-2">
			{#each event.lines as line}
				<p class="text-[11px] leading-relaxed text-gray-600 lg:text-sm">• {line}</p>
			{/each}
		</div>
		<div class="flex flex-col gap-3">
			<GameButton size="small" href={encounterHref}>Pokračovat</GameButton>
			<GameButton size="small" onclick={onclose}>Zpět</GameButton>
		</div>
	</div>
</div>
