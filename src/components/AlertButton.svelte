<script lang="ts">
	import { CircleAlert } from '@lucide/svelte';

	type Props = {
		onclick?: () => void;
		disabled?: boolean;
		helpUses?: number;
	};

	let { onclick, disabled = false, helpUses = 0 }: Props = $props();
</script>

<div class="relative w-fit">
	<button
		{onclick}
		{disabled}
		class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-0 transition-all {!disabled
			? 'bg-secondary shadow-[0_6px_0_var(--secondary-2)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--secondary-2)] active:translate-y-0.5 active:shadow-[0_4px_0_var(--secondary-2)]'
			: 'bg-gray-500 shadow-[0_6px_0_rgb(55,65,81)]'}"
	>
		<CircleAlert size={35} color="white" />
	</button>
	{#if helpUses > 0}
		<div
			class="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-black"
		>
			<span class="text-xs font-bold text-white">{helpUses}</span>
		</div>
	{/if}
</div>
