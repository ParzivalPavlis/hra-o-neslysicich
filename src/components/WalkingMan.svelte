<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		facingRight?: boolean;
		isWalking?: boolean;
	};

	let { facingRight = false, isWalking = false }: Props = $props();

	let frame = $state(1);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		if (isWalking) {
			frame = 1;
			intervalId = setInterval(() => {
				frame = frame === 1 ? 2 : 1;
			}, 250);
		} else {
			if (intervalId !== null) {
				clearInterval(intervalId);
				intervalId = null;
			}
		}

		return () => {
			if (intervalId !== null) {
				clearInterval(intervalId);
				intervalId = null;
			}
		};
	});

	const imageSrc = $derived(
		isWalking ? `/assets/level9/walking${frame}.png` : '/assets/level9/standing1.png'
	);
</script>

<img
	src={imageSrc}
	alt="Tomáš"
	draggable="false"
	class={cn(
		'block h-55 w-fit object-contain transition-transform duration-100 lg:h-75',
		facingRight && 'scale-x-[-1]'
	)}
/>
