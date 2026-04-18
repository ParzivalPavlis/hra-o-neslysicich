<script lang="ts">
	import { colors } from '$lib/client/shared/colors';
	import { Footprints } from '@lucide/svelte';

	type Props = {
		screenX: number;
	};

	let { screenX }: Props = $props();
</script>

<div
	class="pointer-events-none absolute bottom-29 z-15 flex -translate-x-1/2 flex-col items-center"
	style="left: {screenX}px"
>
	<div class="animate-bounce text-gray-400">
		<Footprints color={colors.secondary} size={36} />
	</div>
	<div class="h-35 w-0 border-l-2 border-dashed border-secondary"></div>
	<div class="h-4 w-4 rounded-full bg-secondary"></div>
</div>
