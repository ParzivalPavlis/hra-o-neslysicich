<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let { children, className = '' }: { children: Snippet; className?: string } = $props();
</script>

<h1 class={cn('text-center text-[54px] leading-15 font-bold', className)}>
	{@render children()}
</h1>
