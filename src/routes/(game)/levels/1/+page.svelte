<script lang="ts">
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Button from '$components/ui/button/button.svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';

	const characterGroups: { [key: number]: TalkingPersonType[] } = {
		1: [
			{
				name: 'Matěj',
				dialog: [
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
				dialog: [
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
				dialog: [
					{ text: 'Slyšel jsi včera tu bouřku?', duration: 2300 },
					{ text: 'Já taky! Nemohl jsem spát hodiny.', duration: 2300 },
					{ text: 'To je pravda. Dnes je krásně.', duration: 2300 },
					{ text: 'Super nápad! Kam půjdeme?', duration: 2300 }
				],
				variant: 'man2',
				rotation: 'left',
				pauseBetween: { min: 0.5, max: 1 },
				pauseStart: 3000
			},
			{
				name: 'Lucie',
				dialog: [
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

	let conversationStarted = $state(false);
	let currentlySpeaking = $state(new Set<number>());
	let finishedGroups = $state(new Set<number>());
	let selectedCharacter = $state<(typeof allCharacters)[0] | null>(null);
	let currentThoughts = $state(new Map<number, string>());
	let displayedThought = $state('');
	let typingInterval: ReturnType<typeof setInterval> | null = null;
	let lastTypedThought = $state('');

	// Derived thought for selected character
	let selectedCharacterThought = $derived(
		selectedCharacter && currentlySpeaking.has(selectedCharacter.globalId)
			? currentThoughts.get(selectedCharacter.globalId) || ''
			: ''
	);

	// Effect to handle typing animation when selected character's thought changes
	$effect(() => {
		if (selectedCharacterThought && selectedCharacterThought !== lastTypedThought) {
			lastTypedThought = selectedCharacterThought;

			if (typingInterval) clearInterval(typingInterval);
			displayedThought = '';

			let charIndex = 0;
			typingInterval = setInterval(() => {
				if (charIndex < selectedCharacterThought.length) {
					displayedThought += selectedCharacterThought[charIndex];
					charIndex++;
				} else {
					if (typingInterval) {
						clearInterval(typingInterval);
						typingInterval = null;
					}
				}
			}, 40);
		} else if (!selectedCharacterThought) {
			displayedThought = '';
			lastTypedThought = '';
			if (typingInterval) {
				clearInterval(typingInterval);
				typingInterval = null;
			}
		}
	});

	function startGroupConversation(groupId: number) {
		const groupChars = allCharacters.filter((c) => c.groupId === groupId);
		let speakerIndex = 0;
		let thoughtIndex = 0;

		function nextThought() {
			if (finishedGroups.has(groupId)) return;

			const speaker = groupChars[speakerIndex];
			const dialog = speaker.dialog[thoughtIndex];

			// Start speaking
			currentlySpeaking = new Set(currentlySpeaking).add(speaker.globalId);
			if (dialog?.text) {
				currentThoughts.set(speaker.globalId, dialog.text);
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

			// Schedule next thought
			const pauseTime = getRandomDuration(speaker.pauseBetween.min, speaker.pauseBetween.max);
			setTimeout(nextThought, dialog.duration + pauseTime);
		}

		// Start with initial delay
		const firstChar = groupChars[0];
		setTimeout(nextThought, firstChar.pauseStart || 0);
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
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center px-2 py-5 md:p-10">
	{#if !conversationStarted}
		<div class="flex w-full flex-col items-center gap-5 text-center">
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
			<Button
				onclick={startConversation}
				class="w-full max-w-[80%] rounded-lg px-20 py-10 text-3xl font-bold md:max-w-75"
			>
				Začít
			</Button>
		</div>
	{:else}
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
