<script lang="ts">
	import type { LevelTrailVariants } from '$types/levelTrails';

	let {
		color = 'rgb(217, 119, 6)',
		strokeWidth = 12,
		variant = 3
	}: { color?: string; strokeWidth?: number; variant?: LevelTrailVariants } = $props();

	const curves: Record<LevelTrailVariants, string> = {
		1: 'M 50 0 Q 30 50 50 100 Q 70 150 50 200 Q 30 250 50 300 Q 70 350 50 400', // Tight waves
		2: 'M 50 0 Q 20 50 50 100 Q 80 150 50 200 Q 20 250 50 300 Q 80 350 50 400', // Small waves
		3: 'M 50 0 Q 10 50 50 100 Q 90 150 50 200 Q 10 250 50 300 Q 90 350 50 400', // Medium waves
		4: 'M 50 0 Q 0 50 50 100 Q 100 150 50 200 Q 0 250 50 300 Q 100 350 50 400', // Large waves
		5: 'M 50 0 Q -20 50 50 100 Q 120 150 50 200 Q -20 250 50 300 Q 120 350 50 400', // Very large waves
		6: 'M 50 0 Q -50 50 50 100 Q 150 150 50 200 Q -50 250 50 300 Q 150 350 50 400' // Extreme waves
	};
</script>

<svg
	class="absolute -top-95 left-1/2 h-100 w-25 -translate-x-1/2 transform"
	viewBox="0 0 100 400"
	style="overflow: visible;"
>
	<path
		d={curves[variant]}
		stroke={color}
		stroke-width={strokeWidth}
		fill="none"
		stroke-linecap="round"
		stroke-dasharray="26"
	/>
</svg>
