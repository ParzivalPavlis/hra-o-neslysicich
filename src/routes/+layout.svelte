<script lang="ts">
	import './layout.css';
	import { navigating } from '$app/state';
	import { fade } from 'svelte/transition';
	import Logo from '$components/Logo.svelte';

	let { children } = $props();

	let showOverlay = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (navigating.to) {
			timer = setTimeout(() => (showOverlay = true), 500);
		} else {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			showOverlay = false;
		}
	});
</script>

<svelte:head><link rel="icon" href="/icons/logo.svg" /></svelte:head>

{#if showOverlay}
	<div
		transition:fade={{ duration: 150 }}
		class="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-primary"
	>
		<Logo fillColor="white" />
		<div class="flex gap-2">
			<span class="dot bg-white"></span>
			<span class="dot bg-white" style="animation-delay: 0.2s"></span>
			<span class="dot bg-white" style="animation-delay: 0.4s"></span>
		</div>
	</div>
{/if}

{@render children()}

<style>
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		animation: bounce 0.6s ease-in-out infinite alternate;
	}

	@keyframes bounce {
		from {
			opacity: 0.3;
			transform: translateY(0);
		}
		to {
			opacity: 1;
			transform: translateY(-8px);
		}
	}
</style>
