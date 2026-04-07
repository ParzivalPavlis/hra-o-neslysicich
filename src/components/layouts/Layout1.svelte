<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, centered = true }: { children: Snippet; centered?: boolean } = $props();
</script>

<div
	class="relative flex min-h-screen flex-col items-center px-5 pt-10 pb-25 md:p-10 md:pb-30"
	class:justify-center={centered}
>
	{@render children()}
</div>
