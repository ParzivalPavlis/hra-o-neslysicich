<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		children,
		className = '',
		variant = 1
	}: { children: Snippet; className?: string; variant?: 1 | 2 | 3 } = $props();

	const variantClasses = {
		1: 'text-5xl',
		2: 'text-4xl',
		3: 'text-3xl'
	};

	const headingElements = {
		1: 'h3',
		2: 'h2',
		3: 'h1'
	};
</script>

<svelte:element
	this={headingElements[variant]}
	class={cn('font-bold text-foreground', variantClasses[variant], className)}
>
	{@render children()}
</svelte:element>
