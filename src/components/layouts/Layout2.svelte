<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center px-5">
	{@render children()}
</div>
