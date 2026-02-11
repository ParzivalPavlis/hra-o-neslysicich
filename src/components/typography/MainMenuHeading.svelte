<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<h1 class="text-center text-6xl font-bold">{@render children()}</h1>
