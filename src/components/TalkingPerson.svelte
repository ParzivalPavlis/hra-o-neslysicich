<script lang="ts">
	import type { TalkingPersonType } from '$types/talkingPerson';

	let {
		id,
		person,
		onclick = () => {}
	}: { id: number; person: TalkingPersonType; onclick?: () => void } = $props();
</script>

<button
	id={`talking-person-${id}`}
	class="relative cursor-pointer transition-transform hover:scale-105 md:h-60 md:w-40"
	{onclick}
>
	<img
		src={`/assets/level1/${person.variant}.png`}
		alt="Character"
		class="h-full w-full"
		style={`transform: scaleX(${person.rotation === 'left' ? -1 : 1});`}
	/>
</button>
