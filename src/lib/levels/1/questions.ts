import type { QuestionType } from '$types/question';

const group1: QuestionType[] = [
	{
		id: 1,
		question: 'Co dělal Karel včera večer?',
		options: [
			{ id: 'a', text: 'Hrál hry s kamarády', correct: false },
			{ id: 'b', text: 'Seděl nad poznámkami', correct: true },
			{ id: 'c', text: 'Byl venku s kamarády', correct: false }
		]
	},
	{
		id: 2,
		question: 'Co Honza musí udělat v projektu na informatiku?',
		options: [
			{ id: 'a', text: 'Webovou aplikaci a krátkou dokumentaci', correct: true },
			{ id: 'b', text: 'Mobilní aplikaci a prezentaci', correct: false },
			{ id: 'c', text: 'Databázi a seminární práci', correct: false }
		]
	},
	{
		id: 3,
		question: 'Kdy je odevzdání Honzova projektu?',
		options: [
			{ id: 'a', text: 'Ve středu', correct: false },
			{ id: 'b', text: 'V pátek', correct: true },
			{ id: 'c', text: 'Příští pondělí', correct: false }
		]
	},
	{
		id: 4,
		question: 'Co Honzovi ještě chybí dodělat?',
		options: [
			{ id: 'a', text: 'Grafický návrh a prezentace', correct: false },
			{ id: 'b', text: 'Přihlašování a pár věcí v databázi', correct: true },
			{ id: 'c', text: 'Dokumentace', correct: false }
		]
	},
	{
		id: 5,
		question: 'Z jakého předmětu mají příští týden test?',
		options: [
			{ id: 'a', text: 'Z ekonomiky', correct: false },
			{ id: 'b', text: 'Z matematiky', correct: true },
			{ id: 'c', text: 'Z informatiky', correct: false }
		]
	},
	{
		id: 6,
		question: 'Co dělal Honza místo učení?',
		options: [
			{ id: 'a', text: 'Díval se na seriál', correct: false },
			{ id: 'b', text: 'Hrál Minecraft', correct: true },
			{ id: 'c', text: 'Četl si', correct: false }
		]
	},
	{
		id: 7,
		question: 'Do kolika hodin byl Honza vzhůru?',
		options: [
			{ id: 'a', text: 'Skoro do jedné ráno', correct: false },
			{ id: 'b', text: 'Skoro do dvou ráno', correct: true },
			{ id: 'c', text: 'Skoro do tří ráno', correct: false }
		]
	},
	{
		id: 8,
		question: 'Za jak dlouho má Karel termín seminárky?',
		options: [
			{ id: 'a', text: 'Za dva týdny', correct: false },
			{ id: 'b', text: 'Za tři týdny', correct: true },
			{ id: 'c', text: 'Za měsíc', correct: false }
		]
	},
	{
		id: 9,
		question: 'Kolik stran má mít Karlova seminárka?',
		options: [
			{ id: 'a', text: 'Deset stran', correct: false },
			{ id: 'b', text: 'Patnáct stran', correct: true },
			{ id: 'c', text: 'Dvacet stran', correct: false }
		]
	},
	{
		id: 10,
		question: 'Co Karlovi dělá problém v matematice?',
		options: [
			{ id: 'a', text: 'Rovnice', correct: false },
			{ id: 'b', text: 'Slovní úlohy', correct: true },
			{ id: 'c', text: 'Geometrie', correct: false }
		]
	}
];

const questions = {
	group1
};

export default questions;
