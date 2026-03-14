<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, centered = true }: { children: Snippet; centered?: boolean } = $props();
</script>

<div
	class="relative flex min-h-screen flex-col items-center px-5 py-5 md:p-10"
	class:justify-center={centered}
>
	{@render children()}
</div>
