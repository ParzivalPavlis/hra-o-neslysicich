<script lang="ts">
	import { onMount } from 'svelte';
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import Button from '$components/ui/button/button.svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';

	const characterGroups: { [key: number]: TalkingPersonType[] } = {
		1: [
			{
				name: 'Matěj',
				thoughts: [
					{ text: 'Ahoj! Jak se máš dnes?', duration: 2300 },
					{ text: 'To zní skvěle! Co budeš dělat odpoledne?', duration: 2300 },
					{ text: 'Tvoje oblíbená kavárna? Ta na náměstí?', duration: 2300 },
					{ text: 'Přesně tam! Mají nejlepší dort.', duration: 2300 }
				],
				variant: 'man1',
				rotation: 'left',
				pauseBetween: { min: 0.5, max: 1 },
				pauseStart: 1000
			},
			{
				name: 'Anna',
				thoughts: [
					{ text: 'Dobře, děkuji! Jsem trochu unavená.', duration: 2300 },
					{ text: 'Plánuji si zajít do kavárny na kávu.', duration: 2300 },
					{ text: 'Ano! Mají tam výborný čokoládový dort.', duration: 2300 },
					{ text: 'Přidáš se ke mně? Můžeme si popovídat.', duration: 2300 }
				],
				variant: 'woman1',
				rotation: 'right',
				pauseBetween: { min: 0.5, max: 1 },
				pauseStart: 0
			}
		],
		2: [
			{
				name: 'Petr',
				thoughts: [
					{ text: 'Slyšel jsi včera tu bouřku?', duration: 2300 },
					{ text: 'Já taky! Nemohl jsem spát hodiny.', duration: 2300 },
					{ text: 'To je pravda. Dnes je krásně.', duration: 2300 },
					{ text: 'Super nápad! Kam půjdeme?', duration: 2300 }
				],
				variant: 'man2',
				rotation: 'left',
				pauseBetween: { min: 0.5, max: 1 },
				pauseStart: 500
			},
			{
				name: 'Lucie',
				thoughts: [
					{ text: 'Ano! Byla strašně hlasitá!', duration: 2300 },
					{ text: 'Já taky ne. Ale aspoň teď svítí slunce.', duration: 2300 },
					{ text: 'Počasí se hodně zlepšilo. Měli bychom jít ven.', duration: 2300 },
					{ text: 'Co takhle park? Můžeme si tam dát zmrzlinu.', duration: 2300 }
				],
				variant: 'woman2',
				rotation: 'right',
				pauseBetween: { min: 0.5, max: 1 }
			}
		]
	};

	// Helper function to get random value within range (in seconds, returns milliseconds)
	function getRandomDuration(min: number, max: number): number {
		const randomSeconds = Math.random() * (max - min) + min;
		return randomSeconds * 1000;
	}

	let conversationStates: Map<
		number,
		{ currentSpeakerIndex: number; currentThoughtIndex: number }
	> = new Map(
		Object.keys(characterGroups).map((key) => [
			parseInt(key),
			{ currentSpeakerIndex: 0, currentThoughtIndex: 0 }
		])
	);

	let characterStates: Map<number, { currentThoughtIndex: number; currentThought: string }> =
		new Map(
			Object.values(characterGroups)
				.flat()
				.map((char, index) => [
					index,
					{ currentThoughtIndex: 0, currentThought: char.thoughts[0].text }
				])
		);

	let selectedCharacter: TalkingPersonType | null = $state(null);
	let selectedCharacterIndex: number | null = $state(null);
	let selectedThought: string = $state('');
	let displayedThought: string = $state('');
	let typingInterval: number | null = null;
	let conversationIntervals: Map<number, number> = new Map();
	let currentlySpeaking: Set<number> = $state(new Set());
	let lastTypingThought: string = $state('');
	let conversationStarted: boolean = $state(false);
	let finishedGroups: Set<number> = $state(new Set());

	$effect(() => {
		if (selectedCharacterIndex !== null) {
			const isCurrentlySpeaking = currentlySpeaking.has(selectedCharacterIndex);
			const state = characterStates.get(selectedCharacterIndex);

			if (isCurrentlySpeaking && state && selectedCharacter) {
				// Only restart typing if the thought actually changed
				if (state.currentThought !== lastTypingThought) {
					selectedThought = state.currentThought;
					displayedThought = '';
					lastTypingThought = state.currentThought;

					if (typingInterval) {
						clearInterval(typingInterval);
					}

					let charIndex = 0;
					typingInterval = window.setInterval(() => {
						if (charIndex < state.currentThought.length) {
							displayedThought += state.currentThought[charIndex];
							charIndex++;
						} else {
							if (typingInterval) {
								clearInterval(typingInterval);
								typingInterval = null;
							}
						}
					}, 40);
				}
			} else {
				// Character stopped speaking, clear the text
				selectedThought = '';
				displayedThought = '';
				lastTypingThought = '';

				if (typingInterval) {
					clearInterval(typingInterval);
					typingInterval = null;
				}
			}
		}
	});

	function initializeConversation(groupKey: number, group: TalkingPersonType[]) {
		// Function to handle each conversation step
		function updateConversation() {
			const convState = conversationStates.get(groupKey);
			if (!convState) return;

			const currentSpeaker = group[convState.currentSpeakerIndex];
			const currentThought = currentSpeaker.thoughts[convState.currentThoughtIndex];
			const pauseBetween = currentSpeaker.pauseBetween;

			// Calculate global index correctly based on the group's position
			const groupKeys = Object.keys(characterGroups)
				.map((k) => parseInt(k))
				.sort((a, b) => a - b);
			const groupPosition = groupKeys.indexOf(groupKey);
			const charactersBeforeThisGroup = groupKeys
				.slice(0, groupPosition)
				.reduce((sum, key) => sum + characterGroups[key].length, 0);
			const globalIndex = charactersBeforeThisGroup + convState.currentSpeakerIndex;

			// Mark this character as currently speaking
			currentlySpeaking = new Set(currentlySpeaking).add(globalIndex);

			characterStates.set(globalIndex, {
				currentThoughtIndex: convState.currentThoughtIndex,
				currentThought: currentThought.text
			});
			characterStates = characterStates;

			// Get speaking duration from the thought's duration property
			const speakingDuration = currentThought.duration;

			// Get random pause duration
			const pauseDuration = getRandomDuration(pauseBetween.min, pauseBetween.max);

			// Total interval is speaking + pause
			const totalInterval = speakingDuration + pauseDuration;

			// Remove the speaking indicator before next speaker
			setTimeout(() => {
				const newSet = new Set(currentlySpeaking);
				newSet.delete(globalIndex);
				currentlySpeaking = newSet;
			}, speakingDuration * 0.9);

			// Move to next speaker
			convState.currentSpeakerIndex++;

			if (convState.currentSpeakerIndex >= group.length) {
				convState.currentSpeakerIndex = 0;
				convState.currentThoughtIndex++;

				// Check if all thoughts are finished
				if (convState.currentThoughtIndex >= currentSpeaker.thoughts.length) {
					// Mark this group as finished after the current speaker finishes talking
					setTimeout(() => {
						finishedGroups = new Set(finishedGroups).add(groupKey);
					}, speakingDuration);

					if (conversationIntervals.has(groupKey)) {
						clearTimeout(conversationIntervals.get(groupKey)! as unknown as NodeJS.Timeout);
						conversationIntervals.delete(groupKey);
					}
					return; // Stop the conversation for this group
				}
			}

			conversationStates.set(groupKey, convState);

			// Schedule next speaker with combined interval
			const nextInterval = window.setTimeout(updateConversation, totalInterval);

			// Replace the interval in the map
			if (conversationIntervals.has(groupKey)) {
				clearInterval(conversationIntervals.get(groupKey)!);
			}
			conversationIntervals.set(groupKey, nextInterval as unknown as number);
		}

		// Get the pause duration for the first speaker in this group
		const firstSpeaker = group[0];
		const initialPause = firstSpeaker.pauseStart ?? 0;

		// Schedule the first updateConversation with the pauseStart delay
		const initialInterval = window.setTimeout(updateConversation, initialPause);
		conversationIntervals.set(groupKey, initialInterval as unknown as number);
	}

	function handleCharacterClick(character: TalkingPersonType, index: number) {
		const state = characterStates.get(index);
		if (state) {
			selectedCharacter = character;
			selectedCharacterIndex = index;

			// Only show the thought if this character is currently speaking
			if (currentlySpeaking.has(index)) {
				selectedThought = state.currentThought;
				displayedThought = '';

				// Clear any existing typing animation
				if (typingInterval) {
					clearInterval(typingInterval);
				}

				// Start typing animation
				let charIndex = 0;
				typingInterval = window.setInterval(() => {
					if (charIndex < state.currentThought.length) {
						displayedThought += state.currentThought[charIndex];
						charIndex++;
					} else {
						if (typingInterval) {
							clearInterval(typingInterval);
							typingInterval = null;
						}
					}
				}, 40);
			} else {
				// Character is not speaking, show empty text
				selectedThought = '';
				displayedThought = '';

				// Clear any existing typing animation
				if (typingInterval) {
					clearInterval(typingInterval);
					typingInterval = null;
				}
			}
		}
	}

	function closeModal() {
		if (typingInterval) {
			clearInterval(typingInterval);
			typingInterval = null;
		}
		selectedCharacter = null;
		selectedCharacterIndex = null;
		selectedThought = '';
		displayedThought = '';
	}

	function startConversation() {
		conversationStarted = true;
		Object.entries(characterGroups).forEach(([key, group]) => {
			const groupKey = parseInt(key);
			initializeConversation(groupKey, group);
		});
	}

	// Start conversations when component mounts
	onMount(() => {
		// Cleanup on destroy
		return () => {
			conversationIntervals.forEach((interval) => {
				clearTimeout(interval as unknown as NodeJS.Timeout);
			});
			if (typingInterval) {
				clearInterval(typingInterval);
			}
		};
	});
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center px-2 py-5 md:p-10">
	{#if !conversationStarted}
		<Button onclick={startConversation} class="rounded-lg px-20 py-10 text-3xl font-bold">
			Začít
		</Button>
	{:else}
		{#each Object.entries(characterGroups) as [groupKeyStr, group], groupIndex}
			<div class="flex h-fit">
				{#each group as character, charIndex}
					{@const charactersBeforeThisGroup = Object.values(characterGroups)
						.slice(0, groupIndex)
						.reduce((sum, g) => sum + g.length, 0)}
					{@const globalIndex = charactersBeforeThisGroup + charIndex}
					{@const groupKey = parseInt(groupKeyStr)}
					{@const isGroupActive = !finishedGroups.has(groupKey)}
					<TalkingPerson
						id={globalIndex}
						person={character}
						isSpeaking={currentlySpeaking.has(globalIndex)}
						isActive={isGroupActive}
						onclick={() => handleCharacterClick(character, globalIndex)}
					/>
				{/each}
			</div>
		{/each}
	{/if}

	{#if selectedCharacter}
		<div
			class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-opacity"
			role="presentation"
			onclick={closeModal}
			onkeydown={(e) => e.key === 'Escape' && closeModal()}
		>
			<div
				class="animate-zoom flex flex-col items-center gap-6"
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
						<p class="mt-3 text-center text-gray-700 italic">"{displayedThought}"</p>
					</div>
				</div>
				<Button
					onclick={closeModal}
					class="animate-bubble-in text-1xl w-full rounded-lg  px-6 py-2"
				>
					Zavřít
				</Button>
			</div>
		</div>
	{/if}
</div>

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
