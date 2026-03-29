<script lang="ts">
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		className?: string;
	};

	const { className }: Props = $props();
</script>

<div
	class={cn(
		'flex h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center',
		className
	)}
>
	<div class="text-5xl">📱</div>
	<Paragraph className="text-xl font-semibold">
		Prosím otočte zařízení do vodorovné polohy
	</Paragraph>
</div>
