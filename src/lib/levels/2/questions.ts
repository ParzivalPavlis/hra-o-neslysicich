import type { QuestionType } from '$types/question';

const group1: QuestionType[] = [
	{
		id: 1,
		question: 'Kolik projektů má Matěj aktuálně rozpracovaných současně?',
		options: [
			{ id: 'a', text: 'Tři projekty', correct: false },
			{ id: 'b', text: 'Čtyři projekty', correct: true },
			{ id: 'c', text: 'Pět projektů', correct: false }
		]
	},
	{
		id: 2,
		question: 'Kolik stojí dvouletý psychologický kurz, o kterém Tereza uvažuje?',
		options: [
			{ id: 'a', text: '60 000 Kč za celý program', correct: false },
			{ id: 'b', text: '80 000 Kč za celý program', correct: true },
			{ id: 'c', text: '90 000 Kč za celý program', correct: false }
		]
	},
	{
		id: 3,
		question: 'Proč chce Tereza změnit obor?',
		options: [
			{ id: 'a', text: 'Je nespokojená s kolegy a pracovním prostředím', correct: false },
			{ id: 'b', text: 'Chce vyšší plat a větší stabilitu', correct: false },
			{
				id: 'c',
				text: 'Má pocit, že v marketingu jen sleduje čísla a nic skutečně netvoří',
				correct: true
			}
		]
	},
	{
		id: 4,
		question: 'Čeho se Matěj nejvíce obává v souvislosti s kurzem digitálního designu?',
		options: [
			{ id: 'a', text: 'Že kurz nebude kvalitní a nepřinese mu nové dovednosti', correct: false },
			{ id: 'b', text: 'Že nezvládne finanční náklady', correct: false },
			{
				id: 'c',
				text: 'Že to časově nezvládne kvůli množství práce',
				correct: true
			}
		]
	},
	{
		id: 5,
		question: 'Jakou barevnou kombinaci chce klient použít při redesignu webu?',
		options: [
			{ id: 'a', text: 'Modrou a oranžovou', correct: true },
			{ id: 'b', text: 'Tmavě zelenou a šedou', correct: false },
			{
				id: 'c',
				text: 'Modrou a zelenou',
				correct: false
			}
		]
	},
	{
		id: 6,
		question: 'Jak dlouho Tereza pracuje v marketingu?',
		options: [
			{ id: 'a', text: 'Šest let', correct: false },
			{ id: 'b', text: 'Sest a půl let', correct: false },
			{
				id: 'c',
				text: 'Sedm let',
				correct: true
			}
		]
	},
	{
		id: 7,
		question: 'Kolik let je Tereze?',
		options: [
			{ id: 'a', text: '31 let', correct: false },
			{ id: 'b', text: '32 let', correct: true },
			{
				id: 'c',
				text: '30 let',
				correct: false
			}
		]
	},
	{
		id: 8,
		question: 'Kdy má Matěj deadline na prezentaci pro klienta z Brna?',
		options: [
			{ id: 'a', text: 'V pátek', correct: false },
			{ id: 'b', text: 'V neděli', correct: false },
			{
				id: 'c',
				text: 'V pondělí',
				correct: true
			}
		]
	},
	{
		id: 9,
		question: 'Čeho se Tereza nejvíce obává v souvislosti s kurzem psychologie?',
		options: [
			{ id: 'a', text: 'Že nebude mít dost zkušeností oproti ostatním', correct: false },
			{ id: 'b', text: 'Že začne od nuly', correct: true },
			{
				id: 'c',
				text: 'Že nebude zvládat online část výuky',
				correct: false
			}
		]
	},
	{
		id: 10,
		question: 'Jak dlouho má trvat Matějův kurz digitálního designu?',
		options: [
			{ id: 'a', text: 'Tři měsíce', correct: false },
			{ id: 'b', text: 'Půl roku', correct: true },
			{
				id: 'c',
				text: 'Jeden rok',
				correct: false
			}
		]
	}
];

const group2: QuestionType[] = [
	{
		id: 11,
		question:
			'O kolik se rekonstrukce kuchyně u Luciiných rodičů prodražila oproti původnímu plánu?',
		options: [
			{ id: 'a', text: 'O 80 000 Kč', correct: false },
			{ id: 'b', text: 'O 90 000 Kč', correct: true },
			{ id: 'c', text: 'O 100 000 Kč', correct: false }
		]
	},
	{
		id: 12,
		question: 'Kolik let bylo Petrovi, když se odstěhoval od rodičů?',
		options: [
			{ id: 'a', text: '23 let', correct: false },
			{ id: 'b', text: '24 let', correct: true },
			{ id: 'c', text: '25 let', correct: false }
		]
	},
	{
		id: 13,
		question: 'Jak vysoký je Luciin měsíční nájem a jak daleko to má do práce?',
		options: [
			{ id: 'a', text: '18 000 Kč a 10 minut pěšky', correct: true },
			{ id: 'b', text: '15 000 Kč a 10 minut pěšky', correct: false },
			{ id: 'c', text: '18 000 Kč a 20 minut tramvají', correct: false }
		]
	},
	{
		id: 14,
		question: 'Jak velký je Petrův byt a kolik za něj platí měsíčně?',
		options: [
			{ id: 'a', text: '48 m² a 15 000 Kč', correct: true },
			{ id: 'b', text: '50 m² a 15 000 Kč', correct: false },
			{ id: 'c', text: '48 m² a 18 000 Kč', correct: false }
		]
	},
	{
		id: 15,
		question: 'Kolik si Petr a Lucie měsíčně spoří?',
		options: [
			{ id: 'a', text: 'Petr 5 000 Kč, Lucie 8 000 Kč', correct: false },
			{ id: 'b', text: 'Petr 8 000 Kč, Lucie 5 000 Kč', correct: true },
			{ id: 'c', text: 'Petr 8 000 Kč, Lucie 6 000 Kč', correct: false }
		]
	},
	{
		id: 16,
		question: 'Kolik stál Petrův nový fotoaparát?',
		options: [
			{ id: 'a', text: 'Přibližně 30 000 Kč', correct: false },
			{ id: 'b', text: 'Přibližně 32 000 Kč', correct: true },
			{ id: 'c', text: 'Přibližně 35 000 Kč', correct: false }
		]
	},
	{
		id: 17,
		question: 'Jaký roční fotografický cíl si Petr stanovil a kolik sérií už má hotových?',
		options: [
			{ id: 'a', text: '10 sérií, hotové 4', correct: false },
			{ id: 'b', text: '12 sérií, hotové 3', correct: false },
			{ id: 'c', text: '12 sérií, hotové 4', correct: true }
		]
	},
	{
		id: 18,
		question: 'Jak často běhá Lucie a jak dlouhou vzdálenost obvykle uběhne?',
		options: [
			{ id: 'a', text: 'Dvakrát týdně, kolem 5 km', correct: true },
			{ id: 'b', text: 'Třikrát týdně, kolem 5 km', correct: false },
			{ id: 'c', text: 'Dvakrát týdně, kolem 10 km', correct: false }
		]
	},
	{
		id: 19,
		question: 'Jak často Petr běhá a jak dlouhou trasu obvykle zvolí?',
		options: [
			{ id: 'a', text: 'Jednou týdně, kolem 10 km', correct: true },
			{ id: 'b', text: 'Dvakrát týdně, kolem 10 km', correct: false },
			{ id: 'c', text: 'Jednou týdně, kolem 8 km', correct: false }
		]
	},
	{
		id: 20,
		question: 'Kam jel Petr minulý rok na dovolenou v létě a kam v zimě?',
		options: [
			{ id: 'a', text: 'V létě do Chorvatska, v zimě do Špindlerova Mlýna', correct: false },
			{ id: 'b', text: 'V létě na Makarskou riviéru, v zimě do Špindlerova Mlýna', correct: true },
			{ id: 'c', text: 'V létě na Makarskou riviéru, v zimě do Krkonoš', correct: false }
		]
	}
];

const questions = {
	group1,
	group2
};

export default questions;
