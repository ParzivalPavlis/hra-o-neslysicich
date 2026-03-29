<script lang="ts">
	import { ChevronUp } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import GameButton from '$components/GameButton.svelte';
	import type { AnswerOptionType } from '$types/answer';
	import type { LevelAnswersState } from '$types/store';

	type Props = {
		showAnswerTab: boolean;
		answerTabCollapsed: boolean;
		text?: string;
		onCollapsedChange: (collapsed: boolean) => void;
		shuffledOptions: AnswerOptionType[];
		onAnswerClick: (optionId: string) => void;
		showingFeedback: boolean;
		selectedAnswer: string | null;
		isCorrect: boolean;
		correctAnswerId?: string | null;
		isPortrait?: boolean;
		isMobile?: boolean;
		disabledButtons?: Record<string, boolean>;
		showQuestionsMenu?: boolean;
		answers?: LevelAnswersState[];
		currentAnswerIndex?: number;
		totalQuestions?: number;
		onSelectQuestion?: (index: number) => void;
	};

	let {
		showAnswerTab = $bindable(),
		answerTabCollapsed = $bindable(),
		text,
		onCollapsedChange,
		shuffledOptions,
		onAnswerClick,
		showingFeedback,
		selectedAnswer,
		isCorrect,
		correctAnswerId,
		isPortrait = true,
		isMobile = false,
		disabledButtons,
		showQuestionsMenu = false,
		answers = [],
		currentAnswerIndex = 0,
		totalQuestions = 0,
		onSelectQuestion
	}: Props = $props();

	let menuCollapsed = $state(true);

	function showColorFeedback(optionId: string): 1 | 2 | 3 {
		// Show red for disabled (incorrect) buttons
		if (disabledButtons?.[optionId]) return 3;
		// Show feedback while showing feedback state
		if (!showingFeedback) return 1;
		// Highlight correct answer in green
		if (correctAnswerId === optionId) return 2;
		// Highlight selected wrong answer in red
		if (selectedAnswer === optionId) return isCorrect ? 2 : 3;
		return 1;
	}

	function getStatus(questionIndex: number) {
		const answer = answers.find((a) => a.questionId === questionIndex);
		if (!answer) return 'unanswered';
		return answer.isCorrect ? 'correct' : 'incorrect';
	}

	$effect(() => {
		// Reset when new question loads
		shuffledOptions;
	});
</script>

{#if showAnswerTab}
	{#if isMobile && !isPortrait}
		<!-- Mobile landscape: collapsible tab at bottom -->
		<div
			class="fixed right-0 bottom-0 left-0 z-40 transition-all duration-300"
			class:max-h-96={!answerTabCollapsed || !menuCollapsed}
			class:max-h-20={answerTabCollapsed && menuCollapsed}
		>
			<div class="flex gap-2 border-foreground px-2 pt-1">
				<button
					onclick={() => {
						answerTabCollapsed = !answerTabCollapsed;
						onCollapsedChange(answerTabCollapsed);
						menuCollapsed = true;
					}}
					class="flex flex-1 items-center justify-center gap-2 rounded-t-lg border-2 border-foreground px-2 py-1 transition-all {answerTabCollapsed
						? 'border-black bg-white'
						: 'border-primary bg-primary text-white'}"
				>
					<ChevronUp
						size={24}
						class="rotate-180 transition-transform duration-300 {answerTabCollapsed
							? 'rotate-360'
							: ''}"
					/>
					{text}
				</button>
				{#if showQuestionsMenu && totalQuestions > 0}
					<button
						onclick={() => {
							menuCollapsed = !menuCollapsed;
							answerTabCollapsed = true;
						}}
						class="flex flex-1 items-center justify-center gap-2 rounded-t-lg border-2 border-foreground px-2 py-1 transition-all {menuCollapsed
							? 'border-black bg-white'
							: 'border-primary bg-primary text-white'}"
					>
						<ChevronUp
							size={24}
							class="rotate-180 transition-transform duration-300 {menuCollapsed
								? 'rotate-360'
								: ''}"
						/>
						SEZNAM
					</button>
				{/if}
			</div>
			{#if !answerTabCollapsed || !menuCollapsed}
				<div
					class="flex overflow-y-auto border-t-2 border-foreground bg-white p-4"
					transition:fly={{ y: 100, duration: 300 }}
				>
					{#if !answerTabCollapsed}
						<div class="flex w-full flex-col gap-4">
							{#each shuffledOptions as option (option.id)}
								<GameButton
									size="small"
									onclick={() => onAnswerClick(option.id)}
									variant={showColorFeedback(option.id)}
									disabled={disabledButtons?.[option.id] ?? false}
								>
									{option.text}
								</GameButton>
							{/each}
						</div>
					{:else if !menuCollapsed && showQuestionsMenu && totalQuestions > 0}
						<div class="flex w-full flex-wrap gap-2">
							{#each Array.from({ length: totalQuestions }, (_, i) => i) as questionIndex (questionIndex)}
								<button
									type="button"
									onclick={() => onSelectQuestion?.(questionIndex)}
									class={`flex min-w-15 cursor-pointer flex-col items-center gap-1 rounded-lg p-2 transition-all ${
										currentAnswerIndex === questionIndex
											? 'border-2 border-secondary bg-secondary/5'
											: 'border-2 border-gray-300 bg-gray-200 text-foreground hover:bg-gray-300'
									}`}
								>
									<span class="text-xs font-bold">{questionIndex + 1}</span>
									<div
										class={`h-2 w-2 rounded-full ${
											getStatus(questionIndex) === 'correct'
												? 'bg-green-500'
												: getStatus(questionIndex) === 'incorrect'
													? 'bg-red-500'
													: 'bg-gray-400'
										}`}
									></div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{:else if !isMobile}
		<!-- Desktop: regular layout -->
		<div class="mx-auto mt-4 flex w-full max-w-6xl flex-col gap-4">
			{#each shuffledOptions as option (option.id)}
				<GameButton
					size="small"
					onclick={() => onAnswerClick(option.id)}
					variant={showColorFeedback(option.id)}
					disabled={disabledButtons?.[option.id] ?? false}
				>
					{option.text}
				</GameButton>
			{/each}
		</div>
	{/if}
{/if}
