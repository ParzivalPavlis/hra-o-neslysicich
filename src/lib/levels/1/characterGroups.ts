import type { TalkingPersonType } from '$types/talkingPerson';

const characterGroups: { [key: number]: TalkingPersonType[] } = {
	1: [
		{
			name: 'Honza',
			dialog: [
				{
					text: 'Tenhle týden ve škole byl fakt náročný.',
					duration: 4200
				},
				{
					text: 'Hlavně ten projekt do informatiky. Myslel jsem, že ho budu mít hotový rychle, ale zabral mi skoro celý víkend.',
					duration: 7600
				},
				{
					text: 'Jo, máme udělat webovou aplikaci a k tomu ještě krátkou dokumentaci. Odevzdání je už v pátek.',
					duration: 7600
				},
				{
					text: 'Základ už mám, ale ještě mi chybí přihlašování a pár věcí v databázi.',
					duration: 6600
				},
				{
					text: 'Do toho máme příští týden test z matematiky, takže jsem se chtěl včera učit.',
					duration: 7000
				},
				{
					text: 'Jenže místo toho jsem skončil u Minecraftu a šel jsem spát skoro ve dvě ráno.',
					duration: 7000
				},
				{
					text: 'A co ty, pořád ještě řešíš tu seminárku, jak jsi minule říkal?',
					duration: 5600
				}
			],
			imageSrc: '/assets/level1/man1.png',
			rotation: 'left',
			pauseBetween: { min: 0.5, max: 1 },
			pauseStart: 1000
		},
		{
			name: 'Karel',
			dialog: [
				{
					text: 'To mi povídej, já jsem včera taky seděl nad poznámkami skoro celý večer.',
					duration: 6600
				},
				{
					text: 'To zní docela nepříjemně. Je to ten projekt na programování, co jste dostali minulý týden?',
					duration: 7600
				},
				{
					text: 'Tak to už je docela blízko. Máš na tom aspoň něco hotového, nebo jsi teprve na začátku?',
					duration: 7600
				},
				{
					text: 'To je ještě dobré. Já jsem třeba s jedním referátem ještě ani nezačal.',
					duration: 6600
				},
				{
					text: 'Ten test z matematiky mě děsí taky. Hlavně ty slovní úlohy mi nikdy moc nejdou.',
					duration: 7800
				},
				{
					text: 'To znám. Člověk si řekne, že bude produktivní, a nakonec dělá něco úplně jiného.',
					duration: 7600
				},
				{
					text: 'Jo, pořád ji řeším. Termín mám za tři týdny a má to mít asi patnáct stran.',
					duration: 7400
				}
			],
			imageSrc: '/assets/level1/man2.png',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 }
		}
	]
};

export default characterGroups;
