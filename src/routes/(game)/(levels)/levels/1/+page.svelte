<script lang="ts">
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Button from '$components/ui/button/button.svelte';
	import characterGroups from '$lib/levels/1/characterGroups';
	import { getRandomDuration } from '$lib/shared/utils';
	import { clearLevel1QuestionsState } from '$lib/stores/level1';
	import { RotateCcw } from '@lucide/svelte';
	import { onMount } from 'svelte';

	const SHOW_FULL_DIALOG = true;

	let conversationStarted = $state(false);
	let restartUsed = $state(false);
	let currentlySpeaking = $state(new Set<number>());
	let finishedGroups = $state(new Set<number>());
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

	function updateMap<K, V>(map: Map<K, V>, key: K, value: V): Map<K, V> {
		map.set(key, value);
		return new Map(map);
	}

	function deleteFromMap<K, V>(map: Map<K, V>, key: K): Map<K, V> {
		map.delete(key);
		return new Map(map);
	}

	function resetConversationState() {
		typingIntervals.forEach((interval) => clearInterval(interval));

		currentlySpeaking = new Set();
		finishedGroups = new Set();
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
			currentlySpeaking = new Set(currentlySpeaking).add(speaker.globalId);
			currentDialogs = updateMap(currentDialogs, speaker.globalId, dialog.text || '');

			// Stop speaking after duration
			setTimeout(() => {
				const newSpeaking = new Set(currentlySpeaking);
				newSpeaking.delete(speaker.globalId);
				currentlySpeaking = newSpeaking;
			}, dialog.duration * 0.9);

			// Move to next speaker
			speakerIndex = (speakerIndex + 1) % groupChars.length;
			if (speakerIndex === 0) thoughtIndex++;

			// Check if finished
			if (thoughtIndex >= speaker.dialog.length) {
				setTimeout(() => {
					finishedGroups = new Set(finishedGroups).add(groupId);
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
		finishedGroups = new Set(Object.keys(characterGroups).map((id) => parseInt(id)));
	}

	onMount(() => {
		clearLevel1QuestionsState();
	});
</script>

<svelte:head>
	<title>Úroveň 1</title>
</svelte:head>

<Layout1>
	{#if !conversationStarted}
		<div class="flex w-full max-w-150 flex-col items-center gap-3 text-center">
			<Paragraph>Nacházíte se v roli neslyšícího člověka v kavárně.</Paragraph>
			<Paragraph>
				Okolo sebe máte další návštěvníky, kteří si povídají a jelikož čekáte na kamaráda, nenapadne
				vás nic lepšího než mezitím zjistit, o čem si ostatní povídají.
			</Paragraph>
			<Paragraph>
				Kliknutím na jednotlivé postavy se na ně začnete soustředit a odezírat z jejich úst o čem se
				konkrétně baví.
			</Paragraph>
			<Paragraph>
				Na konci je vaším cílem odpovědět na sérii otázek vztahující se k tématům, o kterých si
				postavy povídaly.
			</Paragraph>
			<GameButton onclick={startConversation} class="w-full max-w-[80%] md:max-w-150">
				Začít
			</GameButton>
		</div>
	{:else}
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

		{#each Object.entries(characterGroups) as [groupKeyStr, group]}
			<div class="flex h-fit">
				{#each group as character}
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
						/>
					{/if}
				{/each}
			</div>
		{/each}
		<div class="flex min-h-26 w-full max-w-150 flex-col text-center">
			{#if allConversationsFinished}
				{#if !restartUsed}
					<GameButton onclick={restartConversation}>
						Zkusit znovu
						<RotateCcw />
					</GameButton>
				{/if}
				<GameButton href="/levels/1/questions" class="mt-3 bg-gray-600 hover:bg-gray-700">
					Pokračovat
				</GameButton>
			{/if}
		</div>
	{/if}
	{#if selectedCharacter}
		<div
			class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-opacity"
			role="presentation"
			onclick={closeModal}
			onkeydown={(e) => e.key === 'Escape' && closeModal()}
		>
			<div
				class="animate-zoom flex max-w-[80%] flex-col items-center gap-6"
				role="dialog"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				tabindex="0"
			>
				<div class="animate-zoom-image h-80 w-64 overflow-hidden rounded-lg bg-white shadow-2xl">
					<img
						src={`/assets/level1/${selectedCharacter.variant}.png`}
						alt={selectedCharacter.name}
						class="h-full w-full object-cover"
						style={`transform: scaleX(${selectedCharacter.rotation === 'left' ? -1 : 1});`}
					/>
				</div>
				<div class="animate-bubble-in relative max-w-md">
					<div class="absolute -top-2 left-1/2 -translate-x-1/2 transform">
						<div
							class="h-0 w-0 border-r-8 border-b-8 border-l-8 border-r-transparent border-b-white border-l-transparent"
						></div>
					</div>
					<div class="rounded-2xl bg-white px-6 py-4 shadow-lg">
						<p class="text-center text-lg font-semibold text-gray-800">{selectedCharacter.name}</p>
						<p class="mt-3 text-center text-gray-700 italic">"{selectedCharacterDialog}"</p>
					</div>
				</div>
				<GameButton onclick={closeModal} class="animate-bubble-in w-full max-w-[256px]">
					Zavřít
				</GameButton>
			</div>
		</div>
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
