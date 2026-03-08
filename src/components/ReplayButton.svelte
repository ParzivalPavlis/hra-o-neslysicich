<script lang="ts">
	import { RotateCcw } from '@lucide/svelte';

	type Props = {
		onclick?: () => void;
		disabled?: boolean;
		helpUses?: number;
	};

	let { onclick, disabled = false, helpUses = 0 }: Props = $props();
</script>

<div class="relative">
	<button
		{onclick}
		{disabled}
		class="flex h-18 w-18 cursor-pointer items-center justify-center rounded-full border-0 transition-all {!disabled
			? 'bg-blue-500 shadow-[0_6px_0_rgb(29,78,216)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_rgb(29,78,216)] active:translate-y-0.5 active:shadow-[0_4px_0_rgb(29,78,216)]'
			: 'bg-gray-500 shadow-[0_6px_0_rgb(55,65,81)]'}"
	>
		<RotateCcw size={55} color="white" />
	</button>
	<div
		class="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-black"
	>
		<span class="text-xs font-bold text-white">{helpUses}</span>
	</div>
</div>
