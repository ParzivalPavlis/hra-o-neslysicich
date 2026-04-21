<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const activeImages = new Set<string>();

	const SLOT_COUNT = 2;

	const GRID = [
		{ x: 25, y: 25 },
		{ x: 75, y: 25 },
		{ x: 25, y: 55 },
		{ x: 75, y: 55 },
		{ x: 25, y: 80 },
		{ x: 75, y: 80 }
	];

	const images = [
		'/assets/levelMap/manDoctor.png',
		'/assets/levelMap/manWalking.png',
		'/assets/levelMap/manBank.png',
		'/assets/levelMap/peopleSigning.png',
		'/assets/levelMap/manDrinking.png',
		'/assets/levelMap/womanLearning.png',
		'/assets/levelMap/manStudying.png'
	];

	const occupiedSlots = new Set<number>();

	function pickImage(exclude: string | null) {
		const available = images.filter((img) => !activeImages.has(img) && img !== exclude);
		const pool = available.length > 0 ? available : images.filter((img) => img !== exclude);
		return pool[Math.floor(Math.random() * pool.length)];
	}

	function pickSlot(exclude: number) {
		const available = GRID.map((_, i) => i).filter((i) => !occupiedSlots.has(i) && i !== exclude);
		const pool =
			available.length > 0 ? available : GRID.map((_, i) => i).filter((i) => i !== exclude);
		return pool[Math.floor(Math.random() * pool.length)];
	}

	type SlotState = {
		image: string;
		gridIndex: number;
		flipped: boolean;
		visible: boolean;
		fadeDuration: number;
	};

	function createSlot(): SlotState {
		const image = pickImage(null);
		activeImages.add(image);
		const gridIndex = pickSlot(-1);
		occupiedSlots.add(gridIndex);
		return { image, gridIndex, flipped: Math.random() < 0.5, visible: false, fadeDuration: 1500 };
	}

	let slots = $state<SlotState[]>(Array.from({ length: SLOT_COUNT }, createSlot));
	const timeouts: ReturnType<typeof setTimeout>[] = [];

	function cycleSlot(i: number) {
		const slot = slots[i];
		slot.flipped = Math.random() < 0.5;
		slot.fadeDuration = 800 + Math.random() * 1400;
		slot.visible = true;

		const showTime = 4000 + Math.random() * 4000;
		timeouts[i] = setTimeout(() => {
			slot.visible = false;
			timeouts[i] = setTimeout(() => {
				activeImages.delete(slot.image);
				occupiedSlots.delete(slot.gridIndex);
				slot.image = pickImage(slot.image);
				activeImages.add(slot.image);
				slot.gridIndex = pickSlot(-1);
				occupiedSlots.add(slot.gridIndex);
				cycleSlot(i);
			}, slot.fadeDuration + 100);
		}, showTime);
	}

	onMount(() => {
		slots.forEach((_, i) => {
			timeouts[i] = setTimeout(() => cycleSlot(i), i * 1500 + Math.random() * 1000);
		});
	});

	onDestroy(() => {
		timeouts.forEach(clearTimeout);
		slots.forEach((slot) => {
			activeImages.delete(slot.image);
			occupiedSlots.delete(slot.gridIndex);
		});
	});
</script>

<div class="relative hidden h-125 w-70 xl:block">
	{#each slots as slot}
		<img
			src={slot.image}
			alt=""
			class="absolute max-h-70 w-auto object-contain"
			style="left: {GRID[slot.gridIndex].x}%; top: {GRID[slot.gridIndex]
				.y}%; transform: translate(-50%, -50%) scaleX({slot.flipped
				? -1
				: 1}); opacity: {slot.visible
				? 1
				: 0}; transition: opacity {slot.fadeDuration}ms ease-in-out"
		/>
	{/each}
</div>
