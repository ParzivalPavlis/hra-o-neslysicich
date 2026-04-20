<script lang="ts">
	import { onMount } from 'svelte';
	import { getOrientationInfo } from '$lib/client/shared/gameUtils';

	type Props = {
		imageSrc?: string;
		label: string;
		visited?: boolean;
		disabled?: boolean;
		onclick?: () => void;
		imageHeightMobile?: number;
		imageHeightDesktop?: number;
	};

	let {
		imageSrc,
		label,
		visited = false,
		disabled = false,
		onclick = () => {},
		imageHeightMobile = 180,
		imageHeightDesktop = 200
	}: Props = $props();

	let isMobile = $state(false);

	function updateOrientation() {
		const orientation = getOrientationInfo();
		isMobile = orientation.isMobile;
	}

	const imageHeight = $derived(isMobile ? imageHeightMobile : imageHeightDesktop);

	onMount(() => {
		updateOrientation();
	});
</script>

<svelte:window onresize={updateOrientation} onorientationchange={updateOrientation} />

<button
	class="flex flex-col items-center gap-1 transition-all duration-150
	{disabled
		? 'cursor-not-allowed opacity-40'
		: 'cursor-pointer hover:-translate-y-2 active:translate-y-0'}"
	{onclick}
	{disabled}
	aria-label={label}
>
	{#if imageSrc}
		<img
			src={imageSrc}
			alt={label}
			draggable="false"
			style="height: {imageHeight}px; width: auto; object-fit: contain; display: block;"
		/>
	{:else}
		<div
			class="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50"
			style="height: {imageHeight}px; width: {imageHeight}px;"
		>
			<span class="px-2 text-center text-[10px] text-gray-400">{label}</span>
		</div>
	{/if}

	<span
		class="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-bold whitespace-nowrap text-gray-700 shadow-sm"
	>
		{label}
	</span>

	{#if visited}
		<span class="text-sm font-bold text-green-500">✓</span>
	{:else if !disabled}
		<span class="animate-bounce text-xs text-gray-400">▼</span>
	{/if}
</button>
