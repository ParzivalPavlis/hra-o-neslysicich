import type { QuestionType } from '$types/question';

const group1: QuestionType[] = [
	{
		id: 1,
		question: 'Kolik času strávil Honza prací na projektu o víkendu?',
		options: [
			{ id: 'a', text: 'Jen pár hodin', correct: false },
			{ id: 'b', text: 'Skoro celý víkend', correct: true },
			{ id: 'c', text: 'Celý týden', correct: false }
		]
	},
	{
		id: 2,
		question: 'Co Honza často dělá místo učení?',
		options: [
			{ id: 'a', text: 'Dívá se na filmy', correct: false },
			{ id: 'b', text: 'Hraje hry', correct: true },
			{ id: 'c', text: 'Chodí ven', correct: false }
		]
	},
	{
		id: 3,
		question: 'Do kolika hodin byl Honza vzhůru, když hrál?',
		options: [
			{ id: 'a', text: 'Do jedné ráno', correct: false },
			{ id: 'b', text: 'Do dvou ráno', correct: true },
			{ id: 'c', text: 'Do tří ráno', correct: false }
		]
	},
	{
		id: 4,
		question: 'Jaký typ projektu Honza vytváří?',
		options: [
			{ id: 'a', text: 'Mobilní aplikaci', correct: false },
			{ id: 'b', text: 'Webovou aplikaci', correct: true },
			{ id: 'c', text: 'Hru', correct: false }
		]
	},
	{
		id: 5,
		question: 'Jaký problém má Honza při učení matematiky?',
		options: [
			{ id: 'a', text: 'Nechápe vzorce', correct: false },
			{ id: 'b', text: 'Ztrácí se ve slovních úlohách', correct: true },
			{ id: 'c', text: 'Nemá poznámky', correct: false }
		]
	},
	{
		id: 6,
		question: 'Jaký druh pohybu dělá Honza kromě běhání?',
		options: [
			{ id: 'a', text: 'Plavání', correct: false },
			{ id: 'b', text: 'Cvičení ve fitku', correct: true },
			{ id: 'c', text: 'Jógu', correct: false }
		]
	},
	{
		id: 7,
		question: 'Co Karel říká o své produktivitě?',
		options: [
			{ id: 'a', text: 'Že pracuje efektivně celý den', correct: false },
			{ id: 'b', text: 'Že často nic neudělá, i když chce', correct: true },
			{ id: 'c', text: 'Že se učí jen ráno', correct: false }
		]
	},
	{
		id: 8,
		question: 'Co Karel říká o běhání?',
		options: [
			{ id: 'a', text: 'Že ho baví víc než kolo', correct: false },
			{ id: 'b', text: 'Že by ho chtěl začít dělat', correct: false },
			{ id: 'c', text: 'Že ho spíš nebaví', correct: true }
		]
	},
	{
		id: 9,
		question: 'Co mají Honza a Karel společné?',
		options: [
			{ id: 'a', text: 'Oba rádi běhají', correct: false },
			{ id: 'b', text: 'Oba odkládají povinnosti', correct: true },
			{ id: 'c', text: 'Oba pracují na stejném projektu', correct: false }
		]
	},
	{
		id: 10,
		question: 'Co plánují udělat po skončení semestru?',
		options: [
			{ id: 'a', text: 'Jet na hory', correct: true },
			{ id: 'b', text: 'Začít nový projekt', correct: false },
			{ id: 'c', text: 'Najít si brigádu', correct: false }
		]
	}
];

const questions = {
	group1
};

export default questions;
