<script lang="ts">
	import { fade } from 'svelte/transition';
	import Paragraph from '$components/typography/Paragraph.svelte';
	import Button from '$components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import type { TalkingPersonType } from '$types/talkingPerson';

	let fadeAnimations = $state(false);

	const characters: TalkingPersonType[] = [
		{
			name: 'Anna',
			thoughts: [
				{ text: 'Tomáši? To snad není možný… jsi to fakt ty?', duration: 2300 },
				{
					text: 'Minimálně šest. Naposledy jsme se viděli na té oslavě u Kláry, pamatuješ?',
					duration: 2300
				},
				{
					text: 'Nakonec jsem tam zůstala skoro čtyři roky. Nejdřív to byl jen projekt na půl roku, ale nějak se to protáhlo. A víš co? Vlastně mi to dost změnilo život.',
					duration: 2300
				},
				{ text: 'Přidáš se ke mně? Můžeme si popovídat.', duration: 2300 }
			],
			variant: 'woman1',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 },
			pauseStart: 0
		},
		{
			name: 'Tomáš',
			thoughts: [
				{
					text: 'Aničko?! No ty jo… já tě málem nepoznal! Kolik let to je? Pět? Šest?',
					duration: 2300
				},
				{
					text: 'Jo! A tys tehdy říkala, že odjíždíš do Brna kvůli práci. Takže… jak to dopadlo?',
					duration: 2300
				},
				{ text: 'Tvoje oblíbená kavárna? Ta na náměstí?', duration: 2300 },
				{ text: 'Přesně tam! Mají nejlepší dort.', duration: 2300 }
			],
			variant: 'man1',
			rotation: 'left',
			pauseBetween: { min: 0.5, max: 1 },
			pauseStart: 1000
		}
	];

	onMount(() => {
		fadeAnimations = true;
	});
</script>

{#if fadeAnimations}
	<div class="relative flex min-h-screen flex-col items-center justify-center px-2 py-5 md:p-10">
		<div class="flex w-full max-w-150 flex-col gap-4">
			<div transition:fade={{ duration: 3000 }}>
				<Paragraph className="text-center">
					Zvuk je pro nás všudypřítomný a často si ani neuvědomujeme, jak moc ho ke každodennímu
					životu potřebujeme.
				</Paragraph>
			</div>
			<div transition:fade={{ delay: 3000, duration: 3000 }}>
				<Paragraph className="text-center">
					Dokážeme se díky němu například orientovat v prostoru, užívat si hudbu a také hlavně
					efektivně komunikovat s ostatními a dokážeme ihned zjistit, co se děje kolem nás a o čem
					se lidé baví.
				</Paragraph>
			</div>
			<div class="flex" transition:fade={{ delay: 6000, duration: 3000 }}>
				<img
					src="/assets/level1/intro/man1.png"
					class="h-full w-1/2"
					alt="Man"
					style="transform: scaleX(-1)"
				/>
				<img src="/assets/level1/intro/woman1.png" class="h-full w-1/2" alt="Woman" />
			</div>
		</div>
		<div transition:fade={{ delay: 9000, duration: 3000 }}>
			<Paragraph className="text-center">
				Co se ale stane, když o něj přijdeme? Jaké to je být neslyšící?
			</Paragraph>
		</div>
		<Button>Pokračovat</Button>
	</div>
{/if}
