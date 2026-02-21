<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center px-5 py-5 md:p-10">
	{@render children()}
</div>
