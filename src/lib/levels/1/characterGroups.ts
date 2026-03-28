import type { TalkingPersonType } from '$types/talkingPerson';

const characterGroups: { [key: number]: TalkingPersonType[] } = {
	1: [
		{
			name: 'Honza',
			dialog: [
				{
					text: 'Jsem rád, že jsme si sedli aspoň na chvíli. Tenhle týden ve škole byl fakt náročný.',
					duration: 7200
				},
				{
					text: 'Hlavně ten projekt do informatiky. Myslel jsem si, že to bude hotové rychle, ale nakonec jsem nad tím seděl skoro celý víkend.',
					duration: 9600
				},
				{
					text: 'Máme udělat webovou aplikaci a k tomu ještě dokumentaci. Odevzdání je už v pátek.',
					duration: 8400
				},
				{
					text: 'Zatím mám hotový základ, ale ještě mi chybí přihlašování a pár věcí v databázi.',
					duration: 7000
				},
				{
					text: 'A do toho máme příští týden test z matematiky, což mi dělá docela problém.',
					duration: 7200
				},
				{
					text: 'Snažím se učit, ale vždycky skončím u něčeho jiného. Třeba včera jsem hrál skoro do dvou ráno.',
					duration: 9400
				},
				{
					text: 'Teď nejvíc hraju Minecraft s kamarády.',
					duration: 5000
				},
				{
					text: 'Snažím se to ale trochu omezit, protože pak nestíhám školu.',
					duration: 6200
				},
				{
					text: 'Kromě toho chodím občas cvičit a začal jsem víc běhat.',
					duration: 6200
				},
				{
					text: 'Chtěl bych v květnu uběhnout pět kilometrů pod dvacet pět minut.',
					duration: 7000
				},
				{
					text: 'A co ty? Pořád řešíš tu seminárku?',
					duration: 4600
				},
				{
					text: 'To zní zajímavě. A kolik stran to má mít?',
					duration: 5200
				},
				{
					text: 'To není úplně málo. Já bych to určitě odkládal na poslední chvíli.',
					duration: 6800
				},
				{
					text: 'Každopádně ještě pár týdnů vydržet a pak bude klid.',
					duration: 6200
				},
				{
					text: 'Možná bych pak jel na pár dní na hory, když to vyjde.',
					duration: 6200
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
					text: 'To mi povídej. Já jsem včera taky seděl nad poznámkami skoro celý večer.',
					duration: 8200
				},
				{
					text: 'To je ten projekt na programování, co jste dostali minulý týden?',
					duration: 6200
				},
				{
					text: 'Aha, tak to je docela velké. Já jsem s jedním referátem ještě ani nezačal.',
					duration: 7000
				},
				{
					text: 'Ten test z matematiky mě taky děsí. Hlavně ty složitější příklady.',
					duration: 7200
				},
				{
					text: 'To znám. Člověk chce být produktivní a pak zjistí, že nic neudělal.',
					duration: 7800
				},
				{
					text: 'Co teď vlastně nejvíc hraješ?',
					duration: 4200
				},
				{
					text: 'Já poslední dobou spíš čtu nebo jezdím na kole, když je čas.',
					duration: 7200
				},
				{
					text: 'Na kole dám klidně třicet kilometrů, když je hezky.',
					duration: 6200
				},
				{
					text: 'To běhání zní dobře. Pod dvacet pět bys to mohl dát.',
					duration: 6200
				},
				{
					text: 'Jo, seminárku pořád řeším. Termín mám za tři týdny.',
					duration: 7000
				},
				{
					text: 'Má to mít asi patnáct stran, takže už bych měl začít.',
					duration: 6200
				},
				{
					text: 'To odkládání máme asi společné.',
					duration: 4200
				},
				{
					text: 'Ještě přežít zkoušky a pak bude klid.',
					duration: 5200
				},
				{
					text: 'Hory by byly super, já bych jel hned.',
					duration: 4800
				},
				{
					text: 'Tak se pak domluvíme.',
					duration: 3200
				}
			],
			imageSrc: '/assets/level1/man2.png',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 }
		}
	]
};

export default characterGroups;
