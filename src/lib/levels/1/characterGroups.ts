import type { TalkingPersonType } from '$types/talkingPerson';

const characterGroups: { [key: number]: TalkingPersonType[] } = {
	1: [
		{
			name: 'Tereza',
			dialog: [
				{
					text: 'Tak jsem ráda, že jsme šli sem. Tady to mám fakt ráda. Ten jejich pistáciový cheesecake je nejlepší v Praze.',
					duration: 9000
				},
				{
					text: 'Jo, přesně. V té kavárně na Letné byl moc sladký. Tady je víc krémový a méně cukru. A cappuccino tu dělají z výběrovky z Kolumbie, což je poznat.',
					duration: 11800
				},
				{ text: 'Zase práce?', duration: 2800 },
				{ text: 'To je ten e-shop s outdoorovým vybavením?', duration: 4400 },
				{ text: 'To zní docela dobře. A baví tě to?', duration: 4400 },
				{ text: 'A chtěl bys to změnit?', duration: 3600 },
				{
					text: 'To je docela dost. Ale jestli tě to posune, tak to dává smysl.',
					duration: 6400
				},
				{ text: 'Kolik hodin týdně tomu věnuješ?', duration: 4000 },
				{
					text: 'Tak to je náročné. Já mám teď sice méně přesčasů, ale zase řeším úplně jiný problém.',
					duration: 8400
				},
				{
					text: 'Přemýšlím, že změním obor. Už mě unavuje marketing. Posledních sedm let dělám brand management a mám pocit, že jen optimalizuju kampaně a sleduju čísla.',
					duration: 12800
				},
				{
					text: 'Láká mě psychologie. Konkrétně pracovní psychologie. Dokonce jsem si našla dvouletý kurz, který začíná v říjnu.',
					duration: 9600
				},
				{
					text: 'V Brně, ale výuka je jen jeden víkend měsíčně. Zbytek je online.',
					duration: 6000
				},
				{
					text: 'Asi osmdesát tisíc za celý program. Dá se to platit po semestrech.',
					duration: 6000
				},
				{
					text: 'To jo. Navíc bych asi musela zkrátit úvazek. A to je trochu děsivé.',
					duration: 6400
				},
				{
					text: 'Možná. Nejvíc mě děsí, že začnu od nuly.',
					duration: 6400
				},
				{ text: 'Třicet dva, děkuju pěkně.', duration: 3600 },
				{ text: 'Ty máš vždycky nějakou motivační větu připravenou?', duration: 4800 },
				{
					text: 'Víš co je vtipné? Že oba přemýšlíme o změně, ale každý jiným směrem.',
					duration: 6400
				},
				{
					text: 'A oba se bojíme investice – časové i finanční.',
					duration: 4800
				},
				{
					text: 'Možná jo. A když to nevyjde, aspoň budeme vědět, že jsme to zkusili.',
					duration: 6400
				},
				{
					text: 'Tak na nové začátky.',
					duration: 3200
				}
			],
			variant: 'woman1',
			rotation: 'left',
			pauseBetween: { min: 0.5, max: 1 },
			pauseStart: 1000
		},
		{
			name: 'Matěj',
			dialog: [
				{
					text: 'Ty sis ho dala i minule, ne? Já si pamatuju, že jsi říkala, že je lepší než ten z Letné.',
					duration: 8800
				},
				{
					text: 'Tak to jsem rád, že jsem si dal jen espresso. Já dneska potřebuju kofein. Včera jsem šel spát až kolem půl druhé.',
					duration: 10000
				},
				{
					text: 'Jo. Dokončoval jsem prezentaci pro klienta z Brna. Děláme jim redesign webu a chtějí kompletně změnit vizuální identitu – nové logo, barvy, typografii. Deadline máme v pondělí.',
					duration: 13600
				},
				{
					text: 'Jo, přesně ten. Prodávají hlavně horolezecké vybavení a funkční oblečení. Teď mají takový tmavě zelený vizuál a chtějí to posunout víc do moderní modré a oranžové kombinace.',
					duration: 15200
				},
				{
					text: 'Vlastně jo. Grafika mě baví čím dál víc. Jenže pořád je to jen část mé práce. Oficiálně jsem pořád projektový koordinátor.',
					duration: 9600
				},
				{
					text: 'Přemýšlím o tom. Uvažuju, že si od září udělám půlroční kurz digitálního designu. Stojí asi třicet tisíc, takže to není úplně malá investice.',
					duration: 11200
				},
				{
					text: 'No právě. Jen mám obavu, jestli to zvládnu časově. Teď mám v práci asi čtyři projekty najednou.',
					duration: 8400
				},
				{
					text: 'Práci? Oficiálně čtyřicet. Reálně spíš padesát.',
					duration: 4400
				},
				{
					text: 'Jaký?',
					duration: 2400
				},
				{
					text: 'A kam bys chtěla jít?',
					duration: 3600
				},
				{
					text: 'Fakt? To jsi mi ještě neříkala. Kde to je?',
					duration: 5200
				},
				{
					text: 'A kolik to stojí?',
					duration: 3200
				},
				{
					text: 'To už je větší rozhodnutí než můj kurz.',
					duration: 4800
				},
				{
					text: 'Ale na druhou stranu – děláš marketing už sedm let. Možná je čas na změnu.',
					duration: 6800
				},
				{
					text: 'Kolik ti vlastně je? Třicet jedna?',
					duration: 4000
				},
				{
					text: 'Dobře, třicet dva není konec světa. Spíš začátek druhé kapitoly.',
					duration: 5600
				},
				{
					text: 'Ne, jen si to říkám sám sobě.',
					duration: 4000
				},
				{
					text: 'Ty k lidem, já k vizuálu.',
					duration: 3600
				},
				{
					text: 'Tak možná je to znamení, že bychom do toho měli jít.',
					duration: 5600
				},
				{
					text: 'Přesně. Horší je litovat, že jsme to nikdy nezkusili.',
					duration: 5200
				},
				{
					text: 'Na nové začátky.',
					duration: 3200
				}
			],
			variant: 'man1',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 }
		}
	],
	2: [
		{
			name: 'Petr',
			dialog: [
				{ text: 'Slyšel jsi včera tu bouřku?', duration: 3600 },
				{ text: 'Já taky! Nemohl jsem spát hodiny.', duration: 4000 },
				{ text: 'To je pravda. Dnes je krásně.', duration: 3600 },
				{ text: 'Super nápad! Kam půjdeme?', duration: 3200 }
			],
			variant: 'man2',
			rotation: 'left',
			pauseBetween: { min: 0.5, max: 1 },
			pauseStart: 3000
		},
		{
			name: 'Lucie',
			dialog: [
				{ text: 'Ano! Byla strašně hlasitá!', duration: 3200 },
				{ text: 'Já taky ne. Ale aspoň teď svítí slunce.', duration: 4400 },
				{ text: 'Počasí se hodně zlepšilo. Měli bychom jít ven.', duration: 4400 },
				{ text: 'Co takhle park? Můžeme si tam dát zmrzlinu.', duration: 4800 }
			],
			variant: 'woman2',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 }
		}
	]
};

export default characterGroups;
