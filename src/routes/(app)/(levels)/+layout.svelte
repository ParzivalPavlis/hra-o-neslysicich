<script lang="ts">
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';

	let path = $derived(page.url.pathname);

	let { children } = $props();
</script>

{#key path}
	<div in:fade={{ duration: 180 }} out:fade={{ duration: 140 }} class="min-h-screen">
		<div in:fly={{ y: 8, duration: 180 }} out:fly={{ y: -8, duration: 140 }}>
			{@render children()}
		</div>
	</div>
{/key}
