<script lang="ts">
	import { fade } from 'svelte/transition';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import { onMount, onDestroy } from 'svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import { goto } from '$app/navigation';
	import { beforeNavigate } from '$app/navigation';
	import TalkingPersonTutorial from '$components/tutorials/TalkingPerson.svelte';
	import GameButton from '$components/GameButton.svelte';
	import Layout1 from '$components/layouts/Layout1.svelte';
	import { setLastPlayed } from '$lib/stores/lastPlayed';

	let fadeAnimations = $state(false);
	let manAudio: HTMLAudioElement;
	let womanAudio: HTMLAudioElement;
	let currentSpeaker = $state<'anna' | 'tomas' | null>(null);
	let dialogIndex = $state(0);
	let conversationActive = $state(false);
	let introState = $state<1 | 2 | 3 | 4>(1);

	const characters: TalkingPersonType[] = [
		{
			name: 'Anna',
			dialog: [{ duration: 5000 }, { duration: 6000 }, { duration: 10000 }, { duration: 11000 }],
			imageSrc: '/assets/level1/woman1_standing.png',
			rotation: 'left',
			pauseBetween: { min: 1, max: 1 },
			pauseStart: 0
		},
		{
			name: 'Tomáš',
			dialog: [{ duration: 5500 }, { duration: 5500 }, { duration: 3000 }, { duration: 6000 }],
			imageSrc: '/assets/level1/man1_standing.png',
			rotation: 'right',
			pauseBetween: { min: 1, max: 1 }
		}
	];

	function startConversation() {
		conversationActive = true;
		dialogIndex = 0;
		speakNext();
	}

	function speakNext() {
		if (!conversationActive) return;

		// Determine who speaks next (alternating)
		const isAnnasTurn = dialogIndex % 2 === 0;
		const speaker = isAnnasTurn ? characters[0] : characters[1];
		const speakerName = isAnnasTurn ? 'anna' : 'tomas';

		// Check if we have more dialog
		const dialogLine = Math.floor(dialogIndex / 2);
		if (dialogLine >= speaker.dialog.length) {
			// Conversation finished
			currentSpeaker = null;
			stopAllAudio();
			return;
		}

		// Start speaking
		currentSpeaker = speakerName;
		const currentDialog = speaker.dialog[dialogLine];

		// Play appropriate audio
		stopAllAudio();
		if (speakerName === 'anna') {
			womanAudio.play().catch(console.log);
		} else {
			manAudio.play().catch(console.log);
		}

		// Stop speaking after dialog duration
		setTimeout(() => {
			currentSpeaker = null;
			stopAllAudio();

			// Schedule next speaker with character's pause
			const pauseMin = speaker.pauseBetween.min * 1000;
			const pauseMax = speaker.pauseBetween.max * 1000;
			const pauseTime = Math.random() * (pauseMax - pauseMin) + pauseMin;

			setTimeout(() => {
				dialogIndex++;
				speakNext();
			}, pauseTime);
		}, currentDialog.duration);
	}

	function stopAllAudio() {
		manAudio?.pause();
		womanAudio?.pause();
	}

	function stopAndResetAudio() {
		if (manAudio) {
			manAudio.pause();
			manAudio.currentTime = 0;
		}
		if (womanAudio) {
			womanAudio.pause();
			womanAudio.currentTime = 0;
		}
	}

	function fadeOutAudio() {
		const fadeSteps = 50;
		const fadeInterval = 50; // 50ms between steps for faster fade
		const volumeStep = 0.7 / fadeSteps;

		let currentStep = 0;
		const fadeInterval_id = setInterval(() => {
			currentStep++;
			const newVolume = Math.max(0, 0.7 - volumeStep * currentStep);

			if (manAudio) manAudio.volume = newVolume;
			if (womanAudio) womanAudio.volume = newVolume;

			if (currentStep >= fadeSteps) {
				clearInterval(fadeInterval_id);
				// Stop audio completely when volume reaches 0
				stopAndResetAudio();
			}
		}, fadeInterval);
	}

	function handleContinue() {
		if (introState === 1) {
			manAudio.load();
			womanAudio.load();
			startConversation();
			introState = 2;

			// Start fade out after 5 seconds
			setTimeout(() => {
				fadeOutAudio();
			}, 7000);
		} else if (introState === 2) {
			introState = 3;
		} else if (introState === 3) {
			introState = 4;
		} else if (introState === 4) {
			manAudio.pause();
			womanAudio.pause();
			goto('/levels/1');
		}
	}

	// Stop audio before navigating away
	beforeNavigate(() => {
		conversationActive = false;
		stopAndResetAudio();
	});

	onMount(() => {
		setLastPlayed(1);
		// Initialize audio elements
		manAudio = new Audio('/assets/level1/man_voice.mp3');
		womanAudio = new Audio('/assets/level1/woman_voice.mp3');

		// Set fadeAnimations to true to trigger fade in animations
		fadeAnimations = true;

		manAudio.volume = 0.7;
		womanAudio.volume = 0.7;
		manAudio.currentTime = 0;
		womanAudio.currentTime = 0;

		return () => {
			conversationActive = false;
			stopAndResetAudio();
		};
	});

	// Additional cleanup on component destruction
	onDestroy(() => {
		conversationActive = false;
		stopAndResetAudio();
	});
</script>

<svelte:head>
	<title>Úroveň 1 | Deafio</title>
</svelte:head>

<Layout1>
	<div class="flex w-full max-w-150 flex-col items-center text-justify">
		{#if introState === 1 && fadeAnimations}
			<div in:fade={{ duration: 3000 }}>
				<Paragraph>
					Zvuk je pro nás všudypřítomný a často si ani neuvědomujeme, jak moc ho ke každodennímu
					životu potřebujeme.
				</Paragraph>
			</div>
			<div in:fade={{ delay: 3000, duration: 3000 }}>
				<Paragraph>
					Dokážeme se díky němu například orientovat v prostoru, užívat si hudbu a také hlavně
					efektivně komunikovat s ostatními a dokážeme ihned zjistit, co se děje kolem nás a o čem
					se lidé baví.
				</Paragraph>
			</div>
			<div class="w-full" in:fade={{ delay: 6000, duration: 3000 }}>
				<GameButton onclick={handleContinue} class="mt-5 w-full">Pokračovat</GameButton>
			</div>
		{/if}
		{#if introState === 2}
			<div class="mt-8 flex justify-center" in:fade={{ duration: 3000 }}>
				<TalkingPerson
					id={1}
					person={characters[0]}
					isSpeaking={currentSpeaker === 'anna'}
					finishedSpeaking={false}
				/>
				<TalkingPerson
					id={2}
					person={characters[1]}
					isSpeaking={currentSpeaker === 'tomas'}
					finishedSpeaking={false}
				/>
			</div>
			<div class="flex flex-col items-center" in:fade={{ delay: 6000, duration: 3000 }}>
				<Paragraph className="text-center">Co se ale stane, když o něj přijdeme?</Paragraph>
				<GameButton onclick={handleContinue} class="mt-5 w-full">Pokračovat</GameButton>
			</div>
		{/if}
		{#if introState === 3}
			<Paragraph>
				Nacházíte se v roli neslyšícího člověka ve škole. Čekáte na začátek hodiny a nedaleko od vás
				si dva vaši kamarádi spolu povídají. Protože máte chvíli času, začnete sledovat jejich
				konverzaci a snažíte se odezírat, o čem mluví. Na konci je vaším cílem odpovědět na sérii
				otázek vztahujících se k tématům, o kterých si kamarádi mluvili.
			</Paragraph>
			<GameButton onclick={handleContinue} class="mt-5 w-full">Pokračovat</GameButton>
		{/if}
		{#if introState === 4}
			<Paragraph variant={3} className="font-bold">Vysvětlivky:</Paragraph>
			<TalkingPersonTutorial />
			<GameButton class="w-full max-w-[80%] md:max-w-150" onclick={handleContinue}>
				Začít
			</GameButton>
		{/if}
	</div>
</Layout1>
