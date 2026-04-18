<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import Button from '$components/ui/button/button.svelte';
	import characterGroups from '$lib/levels/1/characterGroups';
	import { deleteFromMap, getRandomDuration, updateMap } from '$lib/client/shared/questionsUtils';
	import { level1 } from '$lib/stores/gameState';
	import { RotateCcw } from '@lucide/svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import { checkIsPlaying } from '$lib/stores/lastPlayed';

	const CURRENT_LEVEL_NUMBER = 1;
	const SHOW_FULL_DIALOG = true;

	let conversationStarted = $state(false);
	let restartUsed = $state(false);
	let currentlySpeaking = $state(new SvelteSet<number>());
	let finishedGroups = $state(new SvelteSet<number>());
	let selectedCharacter = $state<(typeof allCharacters)[0] | null>(null);
	let selectedCharacterClickTime = $state(0);
	let currentDialogs = $state(new Map<number, string>());
	let typedDialogs = $state(new Map<number, string>());
	let typingIntervals = $state(new Map<number, ReturnType<typeof setInterval>>());
	let trackedDialogs = $state(new Map<number, string>());
	let typingStartTimes = $state(new Map<number, number>());

	const allCharacters = Object.entries(characterGroups).flatMap(([groupId, chars]) =>
		chars.map((char, index) => ({
			...char,
			groupId: parseInt(groupId),
			globalId:
				Object.values(characterGroups)
					.slice(0, parseInt(groupId) - 1)
					.reduce((sum, g) => sum + g.length, 0) + index
		}))
	);

	let allConversationsFinished = $derived(
		conversationStarted &&
			Object.keys(characterGroups).every((groupId) => finishedGroups.has(parseInt(groupId)))
	);

	let selectedCharacterTyped = $derived.by(() => {
		if (
			!selectedCharacter ||
			selectedCharacterClickTime === 0 ||
			!currentlySpeaking.has(selectedCharacter.globalId)
		) {
			return '';
		}

		const fullTyped = typedDialogs.get(selectedCharacter.globalId) || '';
		const typingStart = typingStartTimes.get(selectedCharacter.globalId);

		if (typingStart === undefined || typingStart === 0) {
			return '';
		}

		// If SHOW_FULL_DIALOG is true, return all typed text
		if (SHOW_FULL_DIALOG) {
			return fullTyped;
		}

		const timeSinceClick = selectedCharacterClickTime - typingStart;

		if (timeSinceClick < 0) {
			return fullTyped;
		}

		const charsTypedAfterClick = Math.floor(timeSinceClick / 40);
		let charIndex = Math.max(0, Math.min(charsTypedAfterClick, fullTyped.length));
		const missedContent = charIndex > 0;

		// Backtrack to start of current word
		while (charIndex > 0 && fullTyped[charIndex - 1] !== ' ') {
			charIndex--;
		}

		// Backtrack 2 more words
		let wordCount = 0;
		while (charIndex > 0 && wordCount < 2) {
			charIndex--;
			if (fullTyped[charIndex] === ' ') {
				wordCount++;
			}
		}

		// Move forward to start of a word (skip leading spaces)
		while (charIndex < fullTyped.length && fullTyped[charIndex] === ' ') {
			charIndex++;
		}

		let displayText = fullTyped.substring(charIndex);
		if (missedContent && charIndex > 0) {
			displayText = '... ' + displayText;
		}
		return displayText;
	});

	let selectedCharacterDialog = $derived(selectedCharacterTyped);

	function resetConversationState() {
		typingIntervals.forEach((interval) => clearInterval(interval));

		currentlySpeaking = new SvelteSet();
		finishedGroups = new SvelteSet();
		selectedCharacter = null;
		selectedCharacterClickTime = 0;
		currentDialogs = new Map();
		typedDialogs = new Map();
		trackedDialogs = new Map();
		typingIntervals = new Map();
		typingStartTimes = new Map();
	}

	$effect(() => {
		for (const [characterId, dialog] of currentDialogs) {
			const lastDialog = trackedDialogs.get(characterId);

			if (!dialog || dialog === lastDialog) continue;

			// Clear existing interval
			const existingInterval = typingIntervals.get(characterId);
			if (existingInterval) clearInterval(existingInterval);

			// Track new dialog
			trackedDialogs = updateMap(trackedDialogs, characterId, dialog);
			typedDialogs = updateMap(typedDialogs, characterId, '');
			typingStartTimes = updateMap(typingStartTimes, characterId, Date.now());

			// Start typing animation
			let charIndex = 0;
			const newInterval = setInterval(() => {
				if (charIndex < dialog.length) {
					typedDialogs = updateMap(typedDialogs, characterId, dialog.substring(0, charIndex + 1));
					charIndex++;
				} else {
					clearInterval(newInterval);
					typingIntervals = deleteFromMap(typingIntervals, characterId);
				}
			}, 40);

			typingIntervals = updateMap(typingIntervals, characterId, newInterval);
		}

		// Clear typed dialog for characters who stopped speaking
		for (const characterId of Array.from(typedDialogs.keys())) {
			if (!currentlySpeaking.has(characterId) && typedDialogs.get(characterId) !== '') {
				typedDialogs = updateMap(typedDialogs, characterId, '');
			}
		}
	});

	function startGroupConversation(groupId: number) {
		const groupChars = allCharacters.filter((c) => c.groupId === groupId);
		let speakerIndex = 0;
		let thoughtIndex = 0;

		const playNextDialog = () => {
			if (finishedGroups.has(groupId)) return;

			const speaker = groupChars[speakerIndex];
			const dialog = speaker.dialog[thoughtIndex];

			// Start speaking
			currentlySpeaking = new SvelteSet(currentlySpeaking).add(speaker.globalId);
			currentDialogs = updateMap(currentDialogs, speaker.globalId, dialog.text || '');

			// Stop speaking after duration
			setTimeout(() => {
				const newSpeaking = new SvelteSet(currentlySpeaking);
				newSpeaking.delete(speaker.globalId);
				currentlySpeaking = newSpeaking;
			}, dialog.duration * 0.9);

			// Move to next speaker
			speakerIndex = (speakerIndex + 1) % groupChars.length;
			if (speakerIndex === 0) thoughtIndex++;

			// Check if finished
			if (thoughtIndex >= speaker.dialog.length) {
				setTimeout(() => {
					finishedGroups = new SvelteSet(finishedGroups).add(groupId);
				}, dialog.duration);
				return;
			}

			// Schedule next
			const pauseTime = getRandomDuration(speaker.pauseBetween.min, speaker.pauseBetween.max);
			setTimeout(playNextDialog, dialog.duration + pauseTime);
		};

		const firstChar = groupChars[0];
		setTimeout(playNextDialog, firstChar.pauseStart || 0);
	}

	function handleCharacterClick(character: (typeof allCharacters)[0]) {
		selectedCharacter = character;
		selectedCharacterClickTime = Date.now();
	}

	function closeModal() {
		selectedCharacter = null;
		selectedCharacterClickTime = 0;
	}

	function startConversation() {
		conversationStarted = true;
		Object.keys(characterGroups).forEach((groupId) => {
			startGroupConversation(parseInt(groupId));
		});
	}

	function restartConversation() {
		restartUsed = true;
		resetConversationState();

		// Restart conversation
		Object.keys(characterGroups).forEach((groupId) => {
			startGroupConversation(parseInt(groupId));
		});
	}

	function skipConversation() {
		resetConversationState();
		finishedGroups = new SvelteSet(Object.keys(characterGroups).map((id) => parseInt(id)));
	}

	onMount(() => {
		checkIsPlaying(CURRENT_LEVEL_NUMBER);
		startConversation();
		level1.clear();
	});
</script>

<svelte:head>
	<title>Úroveň {CURRENT_LEVEL_NUMBER} | Deafio</title>
</svelte:head>

<Layout1>
	{#if conversationStarted}
		<!-- Development skip button -->
		{#if !allConversationsFinished}
			<div class="mb-6 flex justify-center">
				<Button
					onclick={skipConversation}
					class="rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
				>
					[DEV] Přeskočit rozhovor
				</Button>
			</div>
		{/if}

		{#each Object.entries(characterGroups) as [groupKeyStr, group] (groupKeyStr)}
			<div class="flex h-fit">
				{#each group as character (character.name)}
					{@const globalCharacter = allCharacters.find(
						(c) => c.groupId === parseInt(groupKeyStr) && c.name === character.name
					)}
					{#if globalCharacter}
						<TalkingPerson
							id={globalCharacter.globalId}
							person={character}
							isSpeaking={currentlySpeaking.has(globalCharacter.globalId)}
							finishedSpeaking={finishedGroups.has(globalCharacter.groupId)}
							onclick={() => handleCharacterClick(globalCharacter)}
							showModal={selectedCharacter?.globalId === globalCharacter.globalId}
							dialogText={selectedCharacter?.globalId === globalCharacter.globalId
								? selectedCharacterDialog
								: ''}
							onCloseModal={closeModal}
						/>
					{/if}
				{/each}
			</div>
		{/each}
		{#if allConversationsFinished}
			<div class="fixed inset-0 z-40 flex items-center justify-center">
				<div class="flex w-full max-w-[80%] flex-col text-center md:max-w-150">
					{#if !restartUsed}
						<GameButton onclick={restartConversation}>
							Zkusit znovu
							<RotateCcw />
						</GameButton>
					{/if}
					<GameButton
						href={`/levels/${CURRENT_LEVEL_NUMBER}/questions`}
						class="mt-3 bg-gray-600 hover:bg-gray-700"
					>
						Pokračovat
					</GameButton>
				</div>
			</div>
		{/if}
	{/if}
</Layout1>

<style>
	@keyframes zoom-image {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes bubble-fade {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-zoom-image) {
		animation: zoom-image 0.4s ease-out;
	}

	:global(.animate-bubble-in) {
		animation: bubble-fade 0.4s ease-out 0.25s both;
	}
</style>
