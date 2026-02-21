import type { QuestionType } from '$types/question';

export const questions: QuestionType[] = [
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

export default questions;
