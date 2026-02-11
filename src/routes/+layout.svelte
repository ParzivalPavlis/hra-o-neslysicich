<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';

	let path = $derived(page.url.pathname);
	let shouldAnimate = $derived(path === '/');

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{#key path}
	<div in:fade={{ duration: 180 }} out:fade={{ duration: 140 }} class="min-h-screen">
		{#if shouldAnimate}
			<div in:fly={{ y: 8, duration: 180 }} out:fly={{ y: -8, duration: 140 }}>
				{@render children()}
			</div>
		{:else}
			{@render children()}
		{/if}
	</div>
{/key}
