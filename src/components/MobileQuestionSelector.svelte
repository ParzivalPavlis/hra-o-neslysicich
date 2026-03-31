<script lang="ts">
	import { ChevronUp } from '@lucide/svelte';

	type Props = {
		answerTabCollapsed: boolean;
		listTabCollapsed: boolean;
		text?: string;
		totalQuestions: number;
		onToggleAnswers: () => void;
		onToggleQuestions: () => void;
	};

	let {
		answerTabCollapsed,
		listTabCollapsed,
		text,
		totalQuestions,
		onToggleAnswers,
		onToggleQuestions
	}: Props = $props();
</script>

<div class="flex gap-2 border-foreground px-2 pt-1">
	<button
		type="button"
		onclick={onToggleAnswers}
		class="flex flex-1 items-center justify-center gap-2 rounded-t-lg border-2 border-foreground px-2 py-1 transition-all {answerTabCollapsed
			? 'border-black bg-white'
			: 'border-primary bg-primary text-white'}"
	>
		<ChevronUp
			size={24}
			class="rotate-180 transition-transform duration-300 {answerTabCollapsed ? 'rotate-360' : ''}"
		/>
		{text}
	</button>
	{#if totalQuestions > 0}
		<button
			type="button"
			onclick={onToggleQuestions}
			class="flex flex-1 items-center justify-center gap-2 rounded-t-lg border-2 border-foreground px-2 py-1 transition-all {listTabCollapsed
				? 'border-black bg-white'
				: 'border-primary bg-primary text-white'}"
		>
			<ChevronUp
				size={24}
				class="rotate-180 transition-transform duration-300 {listTabCollapsed ? 'rotate-360' : ''}"
			/>
			SEZNAM
		</button>
	{/if}
</div>
