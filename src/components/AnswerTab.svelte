<script lang="ts">
	import { fly } from 'svelte/transition';
	import GameButton from '$components/GameButton.svelte';
	import ConversationNavigator from '$components/ConversationNavigator.svelte';
	import QuestionSelector from '$components/QuestionSelector.svelte';
	import MobileQuestionSelector from '$components/MobileQuestionSelector.svelte';
	import type { AnswerOptionType, ConversationOptionType } from '$types/answer';
	import type { AnswersState } from '$types/store';
	import { goto } from '$app/navigation';

	type Props = {
		showAnswerTab: boolean;
		answerTabCollapsed: boolean;
		text?: string;
		onCollapsedChange: (collapsed: boolean) => void;
		shuffledOptions: AnswerOptionType[] | ConversationOptionType[];
		onAnswerClick: (optionId: string) => void;
		showingFeedback: boolean;
		selectedAnswer: string | null;
		isCorrect: boolean;
		correctAnswerId?: string | null;
		isPortrait?: boolean;
		isMobile?: boolean;
		disabledButtons?: Record<string, boolean>;
		answers?: AnswersState[];
		currentAnswerIndex?: number;
		totalQuestions?: number;
		onSelectQuestion?: (index: number) => void;
		compleationLink?: string;
		openListTab?: boolean;
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
		answers = [],
		currentAnswerIndex = 0,
		totalQuestions = 0,
		onSelectQuestion,
		compleationLink,
		openListTab = false
	}: Props = $props();

	let listTabCollapsed = $state(true);
	let currentConversationIndex = $state(0);

	function isConversationOption(
		option: AnswerOptionType | ConversationOptionType
	): option is ConversationOptionType {
		return 'dialogue' in option && !('text' in option);
	}

	function isConversationOptions(
		options: AnswerOptionType[] | ConversationOptionType[]
	): options is ConversationOptionType[] {
		return options.length > 0 && isConversationOption(options[0]);
	}

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

	function isLastQuestionAnswered(): boolean {
		if (totalQuestions === 0) return false;
		const lastAnswer = answers.find((a) => a.questionId === totalQuestions - 1);
		return !!lastAnswer;
	}

	function handleContinue() {
		if (compleationLink) {
			goto(compleationLink);
		}
	}

	$effect(() => {
		if (showAnswerTab) {
			if (openListTab) {
				listTabCollapsed = false;
				answerTabCollapsed = true;
			} else {
				listTabCollapsed = true;
				answerTabCollapsed = false;
			}
		}
	});

	$effect(() => {
		currentConversationIndex = 0;
	});

	function toggleAnswerTab() {
		answerTabCollapsed = !answerTabCollapsed;
		onCollapsedChange(answerTabCollapsed);
		listTabCollapsed = true;
	}

	function toggleQuestionTab() {
		listTabCollapsed = !listTabCollapsed;
		answerTabCollapsed = true;
	}
</script>

{#if showAnswerTab}
	{#if isMobile && !isPortrait}
		<!-- Mobile landscape: collapsible tab at bottom -->
		<div
			class="fixed right-0 bottom-0 left-0 z-40 transition-all duration-300"
			class:max-h-96={!answerTabCollapsed || !listTabCollapsed}
			class:max-h-20={answerTabCollapsed && listTabCollapsed}
		>
			<MobileQuestionSelector
				{answerTabCollapsed}
				{listTabCollapsed}
				{text}
				{totalQuestions}
				onToggleAnswers={toggleAnswerTab}
				onToggleQuestions={toggleQuestionTab}
			/>
			{#if !answerTabCollapsed || !listTabCollapsed}
				<div
					class="flex overflow-y-auto border-t-2 border-foreground bg-white p-4"
					transition:fly={{ y: 100, duration: 300 }}
				>
					{#if !answerTabCollapsed}
						{#if isConversationOptions(shuffledOptions)}
							<ConversationNavigator
								options={shuffledOptions}
								selectedIndex={currentConversationIndex}
								disabled={false}
								onOptionClick={(index) => onAnswerClick(shuffledOptions[index].id)}
								variant={showColorFeedback}
								getDisabledOption={(optionId) => disabledButtons?.[optionId] ?? false}
							/>
						{:else}
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
						{/if}
					{:else if !listTabCollapsed && totalQuestions > 0}
						<QuestionSelector
							{totalQuestions}
							{currentAnswerIndex}
							{answers}
							{onSelectQuestion}
							isLastQuestionAnswered={isLastQuestionAnswered()}
							{compleationLink}
							onContinue={handleContinue}
						/>
					{/if}
				</div>
			{/if}
		</div>
	{:else if !isMobile}
		<!-- Desktop: regular layout -->
		{#if isConversationOptions(shuffledOptions)}
			<div class="mx-auto mt-4 flex w-full max-w-6xl flex-col gap-4">
				<ConversationNavigator
					options={shuffledOptions}
					selectedIndex={currentConversationIndex}
					disabled={false}
					onOptionClick={(index) => onAnswerClick(shuffledOptions[index].id)}
					variant={showColorFeedback}
					getDisabledOption={(optionId) => disabledButtons?.[optionId] ?? false}
				/>
			</div>
		{:else}
			<div class="mx-auto mt-4 flex w-full max-w-6xl flex-col gap-4 md:pb-25">
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
{/if}
