import type { TalkingPersonType } from '$types/talkingPerson';

const characterGroups: { [key: number]: TalkingPersonType[] } = {
	1: [
		{
			name: 'Tereza',
			dialog: [
				{
					text: 'Tak jsem ráda, že jsme šli sem. Tady to mám fakt ráda. Ten jejich pistáciový cheesecake je nejlepší v Praze.',
					duration: 8000
				},
				{
					text: 'Jo, přesně. V té kavárně na Letné byl moc sladký. Tady je víc krémový a méně cukru. A cappuccino tu dělají z výběrovky z Kolumbie, což je poznat.',
					duration: 10800
				},
				{ text: 'Zase práce?', duration: 3800 },
				{ text: 'To je ten e-shop s outdoorovým vybavením?', duration: 5400 },
				{ text: 'To zní docela dobře. A baví tě to?', duration: 5400 },
				{ text: 'A chtěl bys to změnit?', duration: 4600 },
				{
					text: 'To je docela dost. Ale jestli tě to posune, tak to dává smysl.',
					duration: 6400
				},
				{ text: 'Kolik hodin týdně tomu věnuješ?', duration: 5000 },
				{
					text: 'Tak to je náročné. Já mám teď sice méně přesčasů, ale zase řeším úplně jiný problém.',
					duration: 7400
				},
				{
					text: 'Přemýšlím, že změním obor. Už mě unavuje marketing. Posledních sedm let dělám brand management a mám pocit, že jen optimalizuju kampaně a sleduju čísla.',
					duration: 11800
				},
				{
					text: 'Láká mě psychologie. Konkrétně pracovní psychologie. Dokonce jsem si našla dvouletý kurz, který začíná v říjnu.',
					duration: 8600
				},
				{
					text: 'V Brně, ale výuka je jen jeden víkend měsíčně. Zbytek je online.',
					duration: 7000
				},
				{
					text: 'Asi osmdesát tisíc za celý program. Dá se to platit po semestrech.',
					duration: 7000
				},
				{
					text: 'To jo. Navíc bych asi musela zkrátit úvazek. A to je trochu děsivé.',
					duration: 5400
				},
				{
					text: 'Možná. Nejvíc mě děsí, že začnu od nuly.',
					duration: 5400
				},
				{ text: 'Třicet dva, děkuju pěkně.', duration: 4600 },
				{ text: 'Ty máš vždycky nějakou motivační větu připravenou?', duration: 5800 },
				{
					text: 'Víš co je vtipné? Že oba přemýšlíme o změně, ale každý jiným směrem.',
					duration: 5400
				},
				{
					text: 'A oba se bojíme investice – časové i finanční.',
					duration: 5800
				},
				{
					text: 'Možná jo. A když to nevyjde, aspoň budeme vědět, že jsme to zkusili.',
					duration: 5400
				},
				{
					text: 'Tak na nové začátky.',
					duration: 4200
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
					text: 'Ty sis ho dala i minule, ne? Já si pamatuju, že jsi říkala, že je lepší než ten z Letné.',
					duration: 7800
				},
				{
					text: 'Tak to jsem rád, že jsem si dal jen espresso. Já dneska potřebuju kofein. Včera jsem šel spát až kolem půl druhé.',
					duration: 9000
				},
				{
					text: 'Jo. Dokončoval jsem prezentaci pro klienta z Brna. Děláme jim redesign webu a chtějí kompletně změnit vizuální identitu – nové logo, barvy, typografii. Deadline máme v pondělí.',
					duration: 12600
				},
				{
					text: 'Jo, přesně ten. Prodávají hlavně horolezecké vybavení a funkční oblečení. Teď mají takový tmavě zelený vizuál a chtějí to posunout víc do moderní modré a oranžové kombinace.',
					duration: 12200
				},
				{
					text: 'Vlastně jo. Grafika mě baví čím dál víc. Jenže pořád je to jen část mé práce. Oficiálně jsem pořád projektový koordinátor.',
					duration: 6600
				},
				{
					text: 'Přemýšlím o tom. Uvažuju, že si od září udělám půlroční kurz digitálního designu. Stojí asi třicet tisíc, takže to není úplně malá investice.',
					duration: 8200
				},
				{
					text: 'No právě. Jen mám obavu, jestli to zvládnu časově. Teď mám v práci asi čtyři projekty najednou.',
					duration: 5400
				},
				{
					text: 'Práci? Oficiálně čtyřicet. Reálně spíš padesát.',
					duration: 5400
				},
				{
					text: 'Jaký?',
					duration: 2400
				},
				{
					text: 'A kam bys chtěla jít?',
					duration: 4600
				},
				{
					text: 'Fakt? To jsi mi ještě neříkala. Kde to je?',
					duration: 6200
				},
				{
					text: 'A kolik to stojí?',
					duration: 4200
				},
				{
					text: 'To už je větší rozhodnutí než můj kurz.',
					duration: 5800
				},
				{
					text: 'Ale na druhou stranu – děláš marketing už sedm let. Možná je čas na změnu.',
					duration: 5800
				},
				{
					text: 'Kolik ti vlastně je? Třicet jedna?',
					duration: 5000
				},
				{
					text: 'Dobře, třicet dva není konec světa. Spíš začátek druhé kapitoly.',
					duration: 6600
				},
				{
					text: 'Ne, jen si to říkám sám sobě.',
					duration: 5000
				},
				{
					text: 'Ty k lidem, já k vizuálu.',
					duration: 4600
				},
				{
					text: 'Tak možná je to znamení, že bychom do toho měli jít.',
					duration: 6600
				},
				{
					text: 'Přesně. Horší je litovat, že jsme to nikdy nezkusili.',
					duration: 6200
				},
				{
					text: 'Na nové začátky.',
					duration: 4200
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
					duration: 7200
				},
				{ text: 'Pořád řešíte tu rekonstrukci?', duration: 4400 },
				{ text: 'To je docela rozdíl. Co se prodražilo?', duration: 4800 },
				{
					text: 'To znám. Když naši před třemi lety dělali koupelnu, taky skončili o sto tisíc výš.',
					duration: 5800
				},
				{
					text: 'Bude to osm let. Bylo mi tehdy dvacet čtyři. Teď už si neumím představit vrátit se zpátky.',
					duration: 6800
				},
				{
					text: 'To je výhoda. Já platím 15 tisíc, ale dojíždím skoro půl hodiny tramvají.',
					duration: 6400
				},
				{ text: 'Jo. Má asi 48 metrů čtverečních. Není velký, ale stačí mi.', duration: 5400 },
				{
					text: 'Přemýšlel. Ale když jsem viděl, že hypotéka na třípokojový byt by vycházela skoro na 28 tisíc měsíčně, tak mě to rychle přešlo.',
					duration: 11400
				},
				{
					text: 'To je dobré. Já dávám osm, ale někdy to poruším, když přijde něco nečekaného.',
					duration: 5600
				},
				{ text: 'Přesně. Ten mě stál skoro 32 tisíc.', duration: 6600 },
				{
					text: 'Snažím se každý víkend aspoň pár hodin. Letos jsem si dal cíl nafotit 12 sérií – zatím mám hotové čtyři.',
					duration: 7800
				},
				{ text: 'Kolikrát týdně?', duration: 3800 },
				{
					text: 'To je dobrý začátek. Já běhám jen jednou týdně, ale delší trasu – kolem deseti kilometrů.',
					duration: 6800
				},
				{
					text: 'Možná. Ale poslední dobou víc řeším rovnováhu. Práce, rodina, koníčky.',
					duration: 5000
				},
				{
					text: 'Jo. Ségra má malého, jsou mu tři roky. Snažím se za nimi jezdit aspoň jednou za dva týdny.',
					duration: 6800
				},
				{ text: 'Proč složitější?', duration: 3800 },
				{ text: 'A má pravdu?', duration: 3800 },
				{
					text: 'To je málo. Já měl minulý rok dva týdny v Chorvatsku a jeden na horách.',
					duration: 7400
				},
				{ text: 'Na Makarské riviéře. A v zimě ve Špindlerově Mlýně.', duration: 6000 },
				{
					text: 'Možná jo. Někdy máme pocit, že musíme všechno zvládnout sami. Ale přitom stačí trochu ubrat.',
					duration: 7000
				},
				{ text: 'Přesně tak.', duration: 2000 }
			],
			imageSrc: '/assets/level2/man2.png',
			rotation: 'left',
			pauseStart: 2000,
			pauseBetween: { min: 0.5, max: 1 }
		},
		{
			name: 'Lucie',
			dialog: [
				{ text: 'To mi povídej. Já jsem skoro každý víkend jezdila za rodiči.', duration: 6400 },
				{
					text: 'Jo. Předělávají kuchyň. Původně to mělo stát asi 250 tisíc, ale už jsme na 340.',
					duration: 6800
				},
				{
					text: 'Hlavně nová linka a spotřebiče. Máma chtěla vestavnou troubu s parní funkcí a táta zase trval na kamenné pracovní desce.',
					duration: 11000
				},
				{ text: 'Já jsem odešla později. Až v sedmadvaceti.', duration: 4400 },
				{
					text: 'Jo, i když nájem 18 tisíc měsíčně není zrovna malý. Ale mám to deset minut pěšky do práce.',
					duration: 8800
				},
				{ text: 'A pořád jsi v tom 2+kk?', duration: 4600 },
				{ text: 'Nepřemýšlel jsi někdy o koupi bytu?', duration: 5200 },
				{ text: 'To chápu. Já dávám stranou asi 5 tisíc.', duration: 5400 },
				{ text: 'Třeba nový foťák?', duration: 4000 },
				{ text: 'Ale fotíš krásně. Kolik času tomu teď věnuješ?', duration: 6400 },
				{ text: 'To je pěkný plán. Já mám zase předsevzetí běhat pravidelně.', duration: 6400 },
				{ text: 'Chtěla bych třikrát. Zatím dávám dvakrát, kolem pěti kilometrů.', duration: 6800 },
				{ text: 'Ty jsi vždycky jel na výkon.', duration: 4800 },
				{ text: 'Máš teď víc kontaktu s rodinou?', duration: 4800 },
				{
					text: 'Já mám s bráchou vztah složitější. Vidíme se tak jednou za měsíc.',
					duration: 6800
				},
				{
					text: 'Má pocit, že jsem moc zaměřená na práci. Že nemám čas na rodinu.',
					duration: 7000
				},
				{ text: 'Možná trochu. Loni jsem si vzala jen týden dovolené místo tří.', duration: 6800 },
				{ text: 'To zní dobře. Kde jste byli?', duration: 4800 },
				{ text: 'Tak vidíš, možná bych si měla taky něco naplánovat.', duration: 6200 },
				{ text: 'A víc si užít věci mimo práci.', duration: 5000 }
			],
			imageSrc: '/assets/level2/woman2.png',
			rotation: 'right',
			pauseBetween: { min: 0.5, max: 1 }
		}
	]
};

export default characterGroups;
