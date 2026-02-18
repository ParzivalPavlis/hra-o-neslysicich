<script lang="ts">
	import { fade } from 'svelte/transition';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';
	import TalkingPerson from '$components/TalkingPerson.svelte';
	import { goto } from '$app/navigation';

	let fadeAnimations = $state(false);
	let manAudio: HTMLAudioElement;
	let womanAudio: HTMLAudioElement;
	let currentSpeaker = $state<'anna' | 'tomas' | null>(null);
	let dialogIndex = $state(0);
	let conversationActive = $state(false);
	let introState = $state<1 | 2>(1);

	const characters: TalkingPersonType[] = [
		{
			name: 'Anna',
			dialog: [{ duration: 5000 }, { duration: 6000 }, { duration: 10000 }, { duration: 11000 }],
			variant: 'woman1_standing',
			rotation: 'left',
			pauseBetween: { min: 1, max: 1 },
			pauseStart: 0
		},
		{
			name: 'Tomáš',
			dialog: [{ duration: 5500 }, { duration: 5500 }, { duration: 3000 }, { duration: 6000 }],
			variant: 'man1_standing',
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

	function fadeOutAudio() {
		const fadeSteps = 50;
		const fadeInterval = 200; // 200ms between steps for slower fade
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
				stopAllAudio();
			}
		}, fadeInterval);
	}

	function handleContinue() {
		if (introState === 1) {
			manAudio.load();
			womanAudio.load();
			startConversation();
			introState = 2;

			// Start fade out when the final paragraph appears (after 8 seconds)
			setTimeout(() => {
				fadeOutAudio();
			}, 13000);
		} else {
			manAudio.pause();
			womanAudio.pause();
			goto('/levels/1');
		}
	}

	onMount(() => {
		fadeAnimations = true;

		// Initialize audio elements
		manAudio = new Audio('/assets/level1/man_voice.mp3');
		womanAudio = new Audio('/assets/level1/woman_voice.mp3');

		manAudio.volume = 0.7;
		womanAudio.volume = 0.7;
		manAudio.currentTime = 0;
		womanAudio.currentTime = 0;

		return () => {
			manAudio?.pause();
			womanAudio?.pause();
		};
	});
</script>

{#if fadeAnimations}
	<div class="relative flex min-h-screen flex-col items-center justify-center px-2 py-5 md:p-10">
		<div class="flex w-full max-w-150 flex-col">
			<div transition:fade={{ duration: 3000 }}>
				<Paragraph className="text-center">
					Zvuk je pro nás všudypřítomný a často si ani neuvědomujeme, jak moc ho ke každodennímu
					životu potřebujeme.
				</Paragraph>
			</div>
			<div transition:fade={{ delay: 3000, duration: 3000 }}>
				<Paragraph className="text-center mt-3">
					Dokážeme se díky němu například orientovat v prostoru, užívat si hudbu a také hlavně
					efektivně komunikovat s ostatními a dokážeme ihned zjistit, co se děje kolem nás a o čem
					se lidé baví.
				</Paragraph>
			</div>
			{#if introState > 1}
				<div class="mt-8 flex justify-center" transition:fade={{ duration: 3000 }}>
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
				<div transition:fade={{ delay: 13000, duration: 3000 }}>
					<Paragraph className="text-center">Co se ale stane, když o něj přijdeme?</Paragraph>
				</div>
			{/if}
		</div>
		<div transition:fade={{ delay: 6000, duration: 3000 }}>
			<Button class="mt-8 text-[16px]" onclick={handleContinue}>Pokračovat</Button>
		</div>
	</div>
{/if}
