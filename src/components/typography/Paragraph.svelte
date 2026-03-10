<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		children,
		className = '',
		variant = 1
	}: { children: Snippet; className?: string; variant?: 1 | 2 | 3 } = $props();

	const variantClasses = {
		1: 'text-[15px] md:text-[17px]',
		2: 'text-[17px] md:text-[20px]',
		3: 'text-[19px] md:text-[24px]'
	};
</script>

<p class={cn('text-foreground', variantClasses[variant], className)}>
	{@render children()}
</p>
