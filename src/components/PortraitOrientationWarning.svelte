<script lang="ts">
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { Smartphone } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	type Props = {
		mode?: 'landscape' | 'portrait';
		className?: string;
	};

	const { mode = 'landscape', className }: Props = $props();

	const text = $derived(
		mode === 'landscape'
			? 'Prosím otočte zařízení do vodorovné polohy'
			: 'Prosím otočte zařízení do svislé polohy'
	);
</script>

<div
	class={cn(
		'flex h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center',
		className
	)}
>
	<Smartphone
		size={64}
		class={mode === 'landscape' ? 'animate-hint-landscape' : 'animate-hint-portrait'}
	/>
	<Paragraph className="text-xl font-semibold">
		{text}
	</Paragraph>
</div>

<style>
	@keyframes hint-landscape {
		0%,
		20% {
			transform: rotate(0deg);
		}
		60%,
		80% {
			transform: rotate(90deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
	@keyframes hint-portrait {
		0%,
		20% {
			transform: rotate(90deg);
		}
		60%,
		80% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(90deg);
		}
	}
	:global(.animate-hint-landscape) {
		animation: hint-landscape 2.4s ease-in-out infinite;
	}
	:global(.animate-hint-portrait) {
		animation: hint-portrait 2.4s ease-in-out infinite;
	}
</style>
