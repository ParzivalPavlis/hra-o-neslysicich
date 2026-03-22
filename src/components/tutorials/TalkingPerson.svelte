<script lang="ts">
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';

	let selectedCharacter = $state<TalkingPersonType | null>(null);

	const person: TalkingPersonType = {
		name: 'Petr Novák',
		variant: 'man1',
		rotation: 'right',
		pauseBetween: {
			min: 1000,
			max: 3000
		},
		dialog: [
			{
				text: 'Ahoj, jak se máš?',
				duration: 2000
			}
		]
	};

	function handleCharacterClick() {
		selectedCharacter = person;
	}

	function closeModal() {
		selectedCharacter = null;
	}
</script>

<div class="flex w-full flex-col">
	<Paragraph>
		Postava která právě mluví je označena bublinou. Kliknutím na ni uvidíte, o čem právě mluví.
		Zkuste kliknout na postavu níže:
	</Paragraph>
	<div class="mx-auto mt-5 w-60 md:w-80">
		<TalkingPerson
			id={1}
			{person}
			isSpeaking={true}
			onclick={handleCharacterClick}
			showModal={selectedCharacter !== null}
			dialogText={selectedCharacter?.dialog[0]?.text || ''}
			onCloseModal={closeModal}
		/>
	</div>
</div>
