<script lang="ts">
	import { ChevronUp } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import GameButton from '$components/GameButton.svelte';
	import type { AnswerOptionType } from '$types/answer';

	type Props = {
		showAnswerTab: boolean;
		answerTabCollapsed: boolean;
		text?: string;
		onCollapsedChange: (collapsed: boolean) => void;
		shuffledOptions: AnswerOptionType[];
		onAnswerClick: (optionId: string) => void;
		showColorFeedback: (optionId: string) => number;
		isPortrait?: boolean;
		isMobile?: boolean;
	};

	let {
		showAnswerTab = $bindable(),
		answerTabCollapsed = $bindable(),
		text,
		onCollapsedChange,
		shuffledOptions,
		onAnswerClick,
		showColorFeedback,
		isPortrait = true,
		isMobile = false
	}: Props = $props();

	function handleCollapsedChange() {
		answerTabCollapsed = !answerTabCollapsed;
		onCollapsedChange(answerTabCollapsed);
	}
</script>

{#if showAnswerTab && !isPortrait && isMobile}
	<div
		class="fixed right-0 bottom-0 left-0 z-40 transition-all duration-300"
		class:max-h-96={!answerTabCollapsed}
		class:max-h-20={answerTabCollapsed}
	>
		<button
			onclick={handleCollapsedChange}
			class="mx-auto flex items-center justify-center rounded-t-lg border-t-2 border-r-2 border-l-2 border-foreground bg-white px-2 py-1"
		>
			<ChevronUp
				size={30}
				class="rotate-180 transition-transform duration-300 {answerTabCollapsed
					? 'rotate-360'
					: ''}"
			/>
			{text}
		</button>
		{#if !answerTabCollapsed}
			<div
				class="flex flex-col gap-4 overflow-y-auto border-t-2 border-foreground bg-white p-4"
				transition:fly={{ y: 100, duration: 300 }}
			>
				{#each shuffledOptions as option (option.id)}
					<GameButton
						size="small"
						onclick={() => onAnswerClick(option.id)}
						variant={showColorFeedback(option.id) as 1 | 2 | 3}
					>
						{option.text}
					</GameButton>
				{/each}
			</div>
		{/if}
	</div>
{/if}
