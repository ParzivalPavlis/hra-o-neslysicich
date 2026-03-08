<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Heading from '$components/typography/Heading.svelte';
	import { Star } from '@lucide/svelte';

	type Props = {
		correctAnswers: number;
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
	};

	let {
		correctAnswers,
		totalQuestions,
		onRetry,
		onBackToLevels,
		title = 'Úroveň dokončena!',
		stars,
		messages
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

<div class="relative flex w-full max-w-180 flex-col items-center gap-8">
	<div class="flex flex-col text-center">
		<Heading variant={2}>{title}</Heading>
	</div>
	<div class="rounded-2xl border-2 border-foreground bg-white p-8 text-center">
		<div class="mb-4 text-6xl font-bold text-foreground">
			{correctAnswers}/{totalQuestions}
		</div>
		<Paragraph>Správných odpovědí</Paragraph>
	</div>
	<div class="flex gap-2">
		{#each Array(3) as _, i}
			<div class="flex">
				{#if i < stars}
					<Star size={55} color="gold" fill="gold" />
				{:else}
					<Star size={55} />
				{/if}
			</div>
		{/each}
	</div>
	<div class="text-center">
		<Paragraph variant={3}>
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
