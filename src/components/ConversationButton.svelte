<script lang="ts">
	import type { DialogueLineType } from '$types/answer';
	import { Button } from '$components/ui/button';
	import { cn } from '$lib/utils';

	type Props = {
		dialogue: DialogueLineType[];
		selected?: boolean;
		disabled?: boolean;
		onClick?: () => void;
		variant?: 1 | 2 | 3;
	};

	let { dialogue, selected = false, disabled = false, onClick, variant = 1 }: Props = $props();

	const speakerNames = {
		M: 'Muž',
		Ž: 'Žena'
	};

	const speakerColors = {
		M: 'text-blue-600',
		Ž: 'text-green-600'
	};

	const variantClasses: Record<1 | 2 | 3, string> = {
		1: 'bg-primary shadow-[0_6px_0_var(--color-secondary)] hover:bg-primary hover:shadow-[0_8px_0_var(--color-secondary)] active:translate-y-0.5 hover:-translate-y-0.5 active:shadow-[0_4px_0_var(--color-secondary)] disabled:bg-gray-500 disabled:shadow-[0_6px_0_rgb(55,65,81)]',
		2: 'bg-green-500 shadow-[0_6px_0_rgb(21,128,61)] hover:bg-green-500 hover:shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-0.5 hover:-translate-y-0.5 active:shadow-[0_4px_0_rgb(21,128,61)] disabled:bg-gray-500 disabled:shadow-[0_6px_0_rgb(55,65,81)]',
		3: 'bg-red-500 shadow-[0_6px_0_rgb(185,28,28)] hover:bg-red-500 hover:shadow-[0_8px_0_rgb(185,28,28)] active:translate-y-0.5 hover:-translate-y-0.5 active:shadow-[0_4px_0_rgb(185,28,28)] disabled:bg-gray-500 disabled:shadow-[0_6px_0_rgb(55,65,81)]'
	};
</script>

<Button
	type="button"
	{disabled}
	onclick={onClick}
	class={cn(
		'h-full w-full cursor-pointer px-8 py-3 text-lg text-wrap whitespace-normal',
		variantClasses[variant],
		selected && 'ring-2 ring-primary ring-offset-2'
	)}
>
	<div class="flex flex-col gap-3 text-left">
		{#each dialogue as line (line.speaker + line.text)}
			<div class="flex items-start gap-3">
				<span class={`min-w-fit font-semibold ${speakerColors[line.speaker]}`}>
					{speakerNames[line.speaker]}:
				</span>
				<span class="flex-1">{line.text}</span>
			</div>
		{/each}
	</div>
</Button>
