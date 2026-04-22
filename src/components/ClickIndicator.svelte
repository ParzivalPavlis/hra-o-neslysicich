<script lang="ts">
	import { colors } from '$lib/client/shared/colors';
	import { Footprints } from '@lucide/svelte';

	type Props = {
		screenX: number;
	};

	let { screenX }: Props = $props();
</script>

<div
	class="pointer-events-none absolute bottom-3 z-15 flex -translate-x-1/2 flex-col items-center lg:bottom-29"
	style="left: {screenX}px"
>
	<div class="animate-bounce text-gray-400">
		<Footprints color={colors.secondary} size={24} class="lg:hidden" />
		<Footprints color={colors.secondary} size={36} class="hidden lg:block" />
	</div>
	<div class="h-16 w-0 border-l-2 border-dashed border-secondary lg:h-35"></div>
	<div class="h-3 w-3 rounded-full bg-secondary lg:h-4 lg:w-4"></div>
</div>
