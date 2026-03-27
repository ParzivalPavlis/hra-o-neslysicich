<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';

	type Props = {
		id: number;
		person: TalkingPersonType;
		isSpeaking?: boolean;
		finishedSpeaking?: boolean;
		onclick?: () => void;
		showModal?: boolean;
		dialogText?: string;
		onCloseModal?: () => void;
	};

	let {
		id,
		person,
		isSpeaking = false,
		finishedSpeaking = false,
		onclick = () => {},
		showModal = false,
		dialogText = '',
		onCloseModal = () => {}
	}: Props = $props();

	function handleCloseModal() {
		onCloseModal?.();
	}
</script>

<div class="relative w-fit">
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
			src={person.imageSrc}
			alt="Character"
			class="h-full w-full"
			style={`transform: scaleX(${person.rotation === 'left' ? -1 : 1});`}
		/>
	</button>

	{#if showModal}
		<div
			class="bg-opacity-50 fixed inset-0 z-50 flex justify-center backdrop-blur-md transition-opacity md:items-center"
			role="presentation"
			onclick={handleCloseModal}
			onkeydown={(e) => e.key === 'Escape' && handleCloseModal()}
		>
			<div
				class="animate-zoom flex max-w-[80%] flex-col items-center gap-4"
				role="dialog"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				tabindex="0"
			>
				<div
					class="animate-zoom-image mt-5 h-62.5 overflow-hidden rounded-lg bg-white shadow-2xl md:mt-0"
				>
					<img
						src={person.imageSrc}
						alt={person.name}
						class="h-full w-50 object-cover"
						style={`transform: scaleX(${person.rotation === 'left' ? -1 : 1});`}
					/>
				</div>
				<div class="animate-bubble-in relative max-w-md">
					<div class="absolute -top-2 left-1/2 -translate-x-1/2 transform">
						<div
							class="h-0 w-0 border-r-8 border-b-8 border-l-8 border-r-transparent border-b-white border-l-transparent"
						></div>
					</div>
					<div class="rounded-2xl bg-white px-6 py-4 shadow-lg">
						<p class="text-center text-lg font-semibold text-gray-800">
							{person.name}
						</p>
						<p class="mt-1 text-center text-[15px] text-gray-700 italic">
							"{dialogText}"
						</p>
					</div>
				</div>
				<GameButton onclick={handleCloseModal} class="animate-bubble-in w-full max-w-[256px]">
					Zavřít
				</GameButton>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes zoom {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes zoom-image {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes bubble-fade {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-zoom) {
		animation: zoom 0.3s ease-out;
	}

	:global(.animate-zoom-image) {
		animation: zoom-image 0.4s ease-out;
	}

	:global(.animate-bubble-in) {
		animation: bubble-fade 0.4s ease-out 0.25s both;
	}
</style>
