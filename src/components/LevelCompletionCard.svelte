<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Heading from '$components/typography/Heading.svelte';
	import LivesIndicator from '$components/LivesIndicator.svelte';
	import { Star } from '@lucide/svelte';

	type Props = {
		correctAnswers?: number;
		totalQuestions: number;
		onRetry: () => void;
		onBackToLevels: () => void;
		title?: string;
		stars: number;
		messages: {
			excellent: string;
			good: string;
			tryAgain: string;
		};
		variant?: 'correctAnswers' | 'lives';
		maxLives?: number;
		lives?: number;
	};

	let {
		correctAnswers,
		totalQuestions,
		onRetry,
		onBackToLevels,
		title = 'Úroveň dokončena!',
		stars,
		messages,
		variant = 'correctAnswers',
		maxLives,
		lives
	}: Props = $props();

	let message = $derived(() => {
		if (stars === 3) {
			return messages.excellent;
		} else if (stars === 2) {
			return messages.good;
		} else {
			return messages.tryAgain;
		}
	});
</script>

<div class="relative flex w-full max-w-180 flex-col items-center gap-4">
	<div class="flex flex-col text-center">
		<Heading variant={2}>{title}</Heading>
	</div>
	<div class="rounded-2xl border-4 border-secondary">
		<div class="rounded-[12px] border-4 border-primary bg-white p-8 text-center">
			{#if variant === 'correctAnswers'}
				<div class="mb-4 text-6xl font-bold text-foreground">
					{correctAnswers}/{totalQuestions}
				</div>
			{:else if variant === 'lives'}
				<div class="mb-4 flex justify-center">
					<LivesIndicator orientation="horizontal" direction="rtl" {lives} {maxLives} size={40} />
				</div>
			{/if}
			<Paragraph>
				{#if variant === 'correctAnswers'}
					Správných odpovědí
				{:else if variant === 'lives'}
					Životů zbylo
				{/if}
			</Paragraph>
		</div>
	</div>
	<div class="flex gap-2">
		{#each [0, 1, 2] as i (i)}
			<div class="flex">
				{#if i < stars}
					<Star size={40} color="gold" fill="gold" />
				{:else}
					<Star size={40} />
				{/if}
			</div>
		{/each}
	</div>
	<div class="text-center">
		<Paragraph variant={2}>
			{message()}
		</Paragraph>
	</div>
	<div class="flex w-full max-w-150 flex-col gap-4">
		<GameButton class="w-full" onclick={onRetry} size="medium" variant={1}>Zkusit znovu</GameButton>
		<GameButton class="w-full" onclick={onBackToLevels} size="medium" variant={1}>
			Zpět na úrovně
		</GameButton>
	</div>
</div>
