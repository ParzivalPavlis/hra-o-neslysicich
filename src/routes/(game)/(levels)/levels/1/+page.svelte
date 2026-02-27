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

	let conversationStarted = $state(false);
	let currentlySpeaking = $state(new Set<number>());
	let finishedGroups = $state(new Set<number>());
	let selectedCharacter = $state<(typeof allCharacters)[0] | null>(null);
	let currentDialogs = $state(new Map<number, string>());
	let typedDialogs = $state(new Map<number, string>()); // Track typed progress per character
	let typingIntervals = $state(new Map<number, ReturnType<typeof setInterval>>()); // Track typing intervals per character
	let restartUsed = $state(false);

	// Flatten characters with group info for simpler management
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

	// Derived dialog for selected character (now shows the typed version)
	let selectedCharacterDialog = $derived(
		selectedCharacter && currentlySpeaking.has(selectedCharacter.globalId)
			? typedDialogs.get(selectedCharacter.globalId) || ''
			: selectedCharacter
				? typedDialogs.get(selectedCharacter.globalId) || ''
				: ''
	);

	// Check if all conversations have finished
	let allConversationsFinished = $derived(
		conversationStarted &&
			Object.keys(characterGroups).every((groupId) => finishedGroups.has(parseInt(groupId)))
	);

	// Effect to handle typing animation when characters start speaking
	$effect(() => {
		// Check for new dialogs that need typing animation
		for (const [characterId, dialog] of currentDialogs) {
			const currentTyped = typedDialogs.get(characterId) || '';

			// If this dialog is new or different, start typing animation
			if (dialog && dialog !== currentTyped && !typingIntervals.has(characterId)) {
				// Clear any existing typing interval for this character
				const existingInterval = typingIntervals.get(characterId);
				if (existingInterval) {
					clearInterval(existingInterval);
				}

				// Start typing animation for this character
				let charIndex = 0;
				typedDialogs.set(characterId, '');
				typedDialogs = new Map(typedDialogs); // Trigger reactivity

				const newInterval = setInterval(() => {
					if (charIndex < dialog.length) {
						const newTyped = dialog.substring(0, charIndex + 1);
						typedDialogs.set(characterId, newTyped);
						typedDialogs = new Map(typedDialogs); // Trigger reactivity
						charIndex++;
					} else {
						// Animation complete, clear interval
						const interval = typingIntervals.get(characterId);
						if (interval) {
							clearInterval(interval);
							typingIntervals.delete(characterId);
							typingIntervals = new Map(typingIntervals); // Trigger reactivity
						}
					}
				}, 40);

				typingIntervals.set(characterId, newInterval);
				typingIntervals = new Map(typingIntervals); // Trigger reactivity
			}
		}

		// Clear typed dialog for characters who stopped speaking
		for (const [characterId, typedDialog] of typedDialogs) {
			if (!currentlySpeaking.has(characterId) && typedDialog !== '') {
				typedDialogs.set(characterId, '');
				typedDialogs = new Map(typedDialogs); // Trigger reactivity
			}
		}
	});

	function startGroupConversation(groupId: number) {
		const groupChars = allCharacters.filter((c) => c.groupId === groupId);
		let speakerIndex = 0;
		let thoughtIndex = 0;

		function nextDialog() {
			if (finishedGroups.has(groupId)) return;

			const speaker = groupChars[speakerIndex];
			const dialog = speaker.dialog[thoughtIndex];

			// Start speaking
			currentlySpeaking = new Set(currentlySpeaking).add(speaker.globalId);
			if (dialog?.text) {
				currentDialogs.set(speaker.globalId, dialog.text);
				currentDialogs = new Map(currentDialogs); // Trigger reactivity
			}

			// Stop speaking after duration
			setTimeout(() => {
				const newSpeaking = new Set(currentlySpeaking);
				newSpeaking.delete(speaker.globalId);
				currentlySpeaking = newSpeaking;
			}, dialog.duration * 0.9);

			// Move to next
			speakerIndex = (speakerIndex + 1) % groupChars.length;
			if (speakerIndex === 0) thoughtIndex++;

			// Check if conversation finished
			if (thoughtIndex >= speaker.dialog.length) {
				setTimeout(() => {
					finishedGroups = new Set(finishedGroups).add(groupId);
				}, dialog.duration);

				return;
			}

			// Schedule next dialog
			const pauseTime = getRandomDuration(speaker.pauseBetween.min, speaker.pauseBetween.max);
			setTimeout(nextDialog, dialog.duration + pauseTime);
		}

		// Start with initial delay
		const firstChar = groupChars[0];
		setTimeout(nextDialog, firstChar.pauseStart || 0);
	}

	function handleCharacterClick(character: (typeof allCharacters)[0]) {
		selectedCharacter = character;
	}

	function closeModal() {
		selectedCharacter = null;
	}

	function startConversation() {
		conversationStarted = true;
		Object.keys(characterGroups).forEach((groupId) => {
			startGroupConversation(parseInt(groupId));
		});
	}

	function restartConversation() {
		// Mark restart as used
		restartUsed = true;

		// Clear any running typing animations
		typingIntervals.forEach((interval) => clearInterval(interval));
		typingIntervals = new Map();

		// Reset conversation state but keep conversationStarted = true
		currentlySpeaking = new Set<number>();
		finishedGroups = new Set<number>();
		selectedCharacter = null;
		currentDialogs = new Map<number, string>();
		typedDialogs = new Map<number, string>();

		// Start new conversation immediately
		Object.keys(characterGroups).forEach((groupId) => {
			startGroupConversation(parseInt(groupId));
		});
	}

	// Development function to skip conversation
	function skipConversation() {
		// Clear any running typing animations
		typingIntervals.forEach((interval) => clearInterval(interval));
		typingIntervals = new Map();

		// Mark all groups as finished
		finishedGroups = new Set(Object.keys(characterGroups).map((id) => parseInt(id)));
		currentlySpeaking = new Set<number>();
		selectedCharacter = null;
		typedDialogs = new Map<number, string>();
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
		<div class="flex w-full max-w-150 flex-col items-center gap-5 text-center">
			<Paragraph>Nacházíte se v roli neslyšícího člověka v kavárně.</Paragraph>
			<Paragraph>
				Okolo sebe máte další návštěvníky, kteří si povídají a jelikož čekáte na kamaráda, nenapadne
				vás nic lepšího než mezitím zjistit, o čem si ostatní povídají.
			</Paragraph>
			<Paragraph>
				Pomocí kliknutí na jednotlivé postavy se na ně začnete soustředit a odezírat z jejich úst o
				čem se konkrétně baví.
			</Paragraph>
			<Paragraph
				>Na konci je vaším cílem odpovědět na sérii otázek vztahující se k tématům, o kterých si
				postavy povídaly.</Paragraph
			>
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
