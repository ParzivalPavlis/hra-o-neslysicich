import type { TalkingPersonType } from '$types/talkingPerson';

const characterGroups: { [key: number]: TalkingPersonType[] } = {
	1: [
		{
			name: 'Tereza',
			dialog: [
				{
					text: 'Tak jsem ráda, že jsme šli sem. Ten jejich pistáciový cheesecake je nejlepší v Praze.',
					duration: 7200
				},
				{
					text: 'Jo, přesně. V té kavárně na Letné byl moc sladký, tady je mnohem lepší.',
					duration: 7600
				},
				{
					text: 'Ježiš, jak to? Co vlastně teďka děláš za projekt?',
					duration: 5000
				},
				{
					text: 'Já poslední dobou přemýšlím, že změním obor. Marketing už mě tolik nenaplňuje.',
					duration: 7600
				},
				{
					text: 'Nejvíc mě na tom ale asi děsí, že bych začínala úplně od nuly.',
					duration: 5400
				}
			],
			imageSrc: '/assets/level2/woman1.png',
			rotation: 'left',
			pauseBetween: { min: 0.5, max: 1 },
			pauseStart: 1000
		},
		{
			name: 'Matěj',
			dialog: [
				{
					text: 'Ty sis ho dala i minule, ne? Pamatuju si, že jsi říkala, že je lepší než ten z Letné.',
					duration: 7600
				},
				{
					text: 'Tak to jsem rád, že jsem si dal jen espresso. Já dneska potřebuju kofein, včera jsem dlouho pracoval.',
					duration: 7800
				},
				{
					text: 'Dokončoval jsem prezentaci pro klienta z Brna, děláme jim redesign webu a deadline máme v pondělí.',
					duration: 8800
				},
				{
					text: 'To chápu. Mě teď zase láká grafika víc než moje současná práce, proto přemýšlím o kurzu digitálního designu.',
					duration: 9800
				},
				{
					text: 'To je pochopitelné. Ale možná je právě teď správná chvíle něco změnit.',
					duration: 6200
				}
			],
			imageSrc: '/assets/level2/man1.png',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 }
		}
	],
	2: [
		{
			name: 'Petr',
			dialog: [
				{
					text: 'Jsem rád, že jsme si konečně našli čas. Poslední měsíc byl nějaký hektický.',
					duration: 6200
				},
				{
					text: 'Pořád řešíte tu rekonstrukci? To musí být docela náročné.',
					duration: 5600
				},
				{
					text: 'To znám. Když naši dělali koupelnu, taky se to dost prodražilo.',
					duration: 6200
				},
				{
					text: 'Já teď zase víc řeším rovnováhu mezi prací, rodinou a koníčky.',
					duration: 6200
				}
			],
			imageSrc: '/assets/level2/man2.png',
			rotation: 'left',
			pauseStart: 4000,
			pauseBetween: { min: 0.5, max: 1 }
		},
		{
			name: 'Lucie',
			dialog: [
				{
					text: 'To mi povídej. Já jsem skoro každý víkend jezdila za rodiči.',
					duration: 5600
				},
				{
					text: 'Jo. Předělávají kuchyň. Původně to mělo stát asi 250 tisíc, ale už jsme na 340.',
					duration: 7200
				},
				{
					text: 'Hlavně nová linka a spotřebiče. Máma chtěla lepší troubu a táta kamennou desku.',
					duration: 8200
				},
				{
					text: 'Já mám zase pocit, že jsem až moc zaměřená na práci a málo na rodinu.',
					duration: 7000
				}
			],
			imageSrc: '/assets/level2/woman2.png',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 }
		}
	]
};

export default characterGroups;
