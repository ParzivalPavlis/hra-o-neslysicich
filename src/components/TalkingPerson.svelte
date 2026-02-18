<script lang="ts">
	import type { TalkingPersonType } from '$types/talkingPerson';

	let {
		id,
		person,
		isSpeaking = false,
		finishedSpeaking = false,
		onclick = () => {}
	}: {
		id: number;
		person: TalkingPersonType;
		isSpeaking?: boolean;
		finishedSpeaking?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<div class="relative">
	{#if isSpeaking}
		<div class="absolute -top-3 left-1/2 z-40 -translate-x-1/2">
			<div class="relative">
				<div class="rounded-full border-black bg-white px-4 py-2 shadow-lg">
					<span class="animate-pulse text-xl font-bold text-gray-700">...</span>
				</div>
				<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 transform">
					<div
						class="h-0 w-0 border-t-4 border-r-4 border-l-4 border-t-white border-r-transparent border-l-transparent"
					></div>
				</div>
			</div>
		</div>
	{/if}
	<button
		id={`talking-person-${id}`}
		class="relative transition-all md:h-100 {finishedSpeaking
			? 'cursor-default opacity-35'
			: 'cursor-pointer opacity-100 hover:scale-105'}"
		onclick={finishedSpeaking ? undefined : onclick}
		disabled={finishedSpeaking}
	>
		<img
			src={`/assets/level1/${person.variant}.png`}
			alt="Character"
			class="h-full w-full"
			style={`transform: scaleX(${person.rotation === 'left' ? -1 : 1});`}
		/>
	</button>
</div>
