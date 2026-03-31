<script lang="ts">
	import LivesIndicator from '$components/LivesIndicator.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';

	let { maxLives = 4 }: { maxLives?: number } = $props();

	let lives = $derived(maxLives);

	$effect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const animate = () => {
			let currentLives = maxLives;

			const decreaseLives = () => {
				lives = currentLives;
				currentLives--;
				if (currentLives >= 0) {
					timeoutId = setTimeout(decreaseLives, 1000);
				} else {
					// Reset to max
					timeoutId = setTimeout(animate, 1000);
				}
			};

			decreaseLives();
		};

		animate();

		return () => clearTimeout(timeoutId);
	});
</script>

<div class="flex w-full flex-col">
	<Paragraph>
		V této úrovni máte {maxLives} životy. Když odpovíte špatně, ztratíte jeden život. Když ztratíte všechny
		životy, budete muset začít úroveň znovu.
	</Paragraph>
	<div class="mx-auto">
		<LivesIndicator {lives} {maxLives} size={30} />
	</div>
</div>
