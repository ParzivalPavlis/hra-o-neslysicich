<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import Button from '$components/ui/button/button.svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';

	const characterGroups: { [key: number]: TalkingPersonType[] } = {
		1: [
			{
				name: 'Matěj',
				thoughts: [
					'Ahoj! Jak se máš dnes?',
					'To zní skvěle! Co budeš dělat odpoledne?',
					'Tvoje oblíbená kavárna? Ta na náměstí?',
					'Přesně tam! Mají nejlepší dort.'
				],
				variant: 'man1',
				rotation: 'left'
			},
			{
				name: 'Anna',
				thoughts: [
					'Dobře, děkuji! Jsem trochu unavená.',
					'Plánuji si zajít do kavárny na kávu.',
					'Ano! Mají tam výborný čokoládový dort.',
					'Přidáš se ke mně? Můžeme si popovídat.'
				],
				variant: 'woman1',
				rotation: 'right'
			}
		],
		2: [
			{
				name: 'Petr',
				thoughts: [
					'Slyšel jsi včera tu bouřku?',
					'Já taky! Nemohl jsem spát hodiny.',
					'To je pravda. Dnes je krásně.',
					'Super nápad! Kam půjdeme?'
				],
				variant: 'man2',
				rotation: 'left'
			},
			{
				name: 'Lucie',
				thoughts: [
					'Ano! Byla strašně hlasitá!',
					'Já taky ne. Ale aspoň teď svítí slunce.',
					'Počasí se hodně zlepšilo. Měli bychom jít ven.',
					'Co takhle park? Můžeme si tam dát zmrzlinu.'
				],
				variant: 'woman2',
				rotation: 'right'
			}
		]
	};

	// Timing configuration for each group (in seconds)
	const groupTimings: {
		[key: number]: {
			characterDuration: number; // milliseconds per character
			pauseBetween: { min: number; max: number };
		};
	} = {
		1: {
			characterDuration: 200, // 50ms per character
			pauseBetween: { min: 0.5, max: 1 } // 0.5-1 second pause between speakers
		},
		2: {
			characterDuration: 50,
			pauseBetween: { min: 0.5, max: 1 }
		}
	};

	// Helper function to get random value within range (in seconds, returns milliseconds)
	function getRandomDuration(min: number, max: number): number {
		const randomSeconds = Math.random() * (max - min) + min;
		return randomSeconds * 1000; // Convert to milliseconds
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
				.map((char, index) => [index, { currentThoughtIndex: 0, currentThought: char.thoughts[0] }])
		);

	let selectedCharacter: TalkingPersonType | null = $state(null);
	let selectedCharacterIndex: number | null = $state(null);
	let selectedThought: string = $state('');
	let displayedThought: string = $state('');
	let typingInterval: number | null = null;
	let conversationIntervals: Map<number, number> = new Map();
	let currentlySpeaking: Set<number> = $state(new Set());
	let lastTypingThought: string = $state(''); // Track the last typed thought to avoid re-triggering

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

			const timing = groupTimings[groupKey];
			const currentSpeaker = group[convState.currentSpeakerIndex];

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
				currentThought: currentSpeaker.thoughts[convState.currentThoughtIndex]
			});
			characterStates = characterStates;

			// Calculate speaking duration based on thought length
			const thoughtLength = currentSpeaker.thoughts[convState.currentThoughtIndex].length;
			const speakingDuration = thoughtLength * timing.characterDuration;

			// Get random pause duration
			const pauseDuration = getRandomDuration(timing.pauseBetween.min, timing.pauseBetween.max);

			// Total interval is speaking + pause
			const totalInterval = speakingDuration + pauseDuration;

			// Remove the speaking indicator before next speaker (10% before speaking ends)
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

				if (convState.currentThoughtIndex >= currentSpeaker.thoughts.length) {
					convState.currentThoughtIndex = 0;
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

		// Run immediately on start
		updateConversation();
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

	// Start conversations when component mounts
	onMount(() => {
		Object.entries(characterGroups).forEach(([key, group]) => {
			const groupKey = parseInt(key);
			initializeConversation(groupKey, group);
		});

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
	{#each Object.entries(characterGroups) as [groupKey, group], groupIndex}
		<div class="flex h-fit">
			{#each group as character, charIndex}
				{@const charactersBeforeThisGroup = Object.values(characterGroups)
					.slice(0, groupIndex)
					.reduce((sum, g) => sum + g.length, 0)}
				{@const globalIndex = charactersBeforeThisGroup + charIndex}
				<div class="relative">
					{#if currentlySpeaking.has(globalIndex)}
						<div class="absolute -top-1 left-1/2 z-40 -translate-x-1/2">
							<div class="relative">
								<div class="rounded-full border-black bg-white px-4 py-2 shadow-lg">
									<span class="animate-pulse text-xl font-bold text-gray-700">...</span>
								</div>
								<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 transform">
									<div
										class="h-0 w-0 border-t-4 border-r-4 border-l-4 border-t-white border-r-transparent border-l-transparent"
									></div>
								</div>
							</div>
						</div>
					{/if}
					<TalkingPerson
						id={globalIndex}
						person={character}
						onclick={() => handleCharacterClick(character, globalIndex)}
					/>
				</div>
			{/each}
		</div>
	{/each}

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
