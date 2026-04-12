<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { fade } from 'svelte/transition';

	let {
		children,
		className = '',
		variant = 1,
		inTransition
	}: { children: Snippet; className?: string; variant?: 1 | 2 | 3; inTransition?: any } = $props();

	const variantClasses = {
		1: 'text-[15px] md:text-[17px]',
		2: 'text-[17px] md:text-[20px]',
		3: 'text-[19px] md:text-[24px]'
	};
</script>

<p class={cn('text-foreground', variantClasses[variant], className)} in:fade={inTransition}>
	{@render children()}
</p>
