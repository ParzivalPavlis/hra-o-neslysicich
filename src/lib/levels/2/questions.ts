import type { QuestionType } from '$types/question';

const group1: QuestionType[] = [
	{
		id: 1,
		question: 'Jaký dort si Tereza dala v kavárně?',
		options: [
			{ id: 'a', text: 'Citronový cheesecake', correct: false },
			{ id: 'b', text: 'Pistáciový cheesecake', correct: true },
			{ id: 'c', text: 'Čokoládový dort', correct: false }
		]
	},
	{
		id: 2,
		question: 'Na čem Matěj pracoval pro klienta z Brna?',
		options: [
			{ id: 'a', text: 'Na nové mobilní aplikaci', correct: false },
			{ id: 'b', text: 'Na redesignu webu', correct: true },
			{ id: 'c', text: 'Na reklamní kampani', correct: false }
		]
	},
	{
		id: 3,
		question: 'Kdy má Matěj deadline?',
		options: [
			{ id: 'a', text: 'V pátek', correct: false },
			{ id: 'b', text: 'V pondělí', correct: true },
			{ id: 'c', text: 'V úterý', correct: false }
		]
	},
	{
		id: 4,
		question: 'O jakém kurzu Matěj přemýšlí?',
		options: [
			{ id: 'a', text: 'O kurzu programování', correct: false },
			{ id: 'b', text: 'O kurzu digitálního designu', correct: true },
			{ id: 'c', text: 'O kurzu marketingu', correct: false }
		]
	},
	{
		id: 5,
		question: 'Jaký obor už Terezu tolik nenaplňuje?',
		options: [
			{ id: 'a', text: 'Psychologie', correct: false },
			{ id: 'b', text: 'Marketing', correct: true },
			{ id: 'c', text: 'Grafika', correct: false }
		]
	},
	{
		id: 6,
		question: 'Co Terezu láká za nový obor?',
		options: [
			{ id: 'a', text: 'Psychologie', correct: true },
			{ id: 'b', text: 'Ekonomie', correct: false },
			{ id: 'c', text: 'Architektura', correct: false }
		]
	},
	{
		id: 7,
		question: 'Čeho se Tereza nejvíc bojí v souvislosti se změnou oboru?',
		options: [
			{ id: 'a', text: 'Že bude mít menší plat', correct: false },
			{ id: 'b', text: 'Že začne úplně od nuly', correct: true },
			{ id: 'c', text: 'Že se bude muset přestěhovat', correct: false }
		]
	},
	{
		id: 8,
		question: 'Co si dal Matěj v kavárně?',
		options: [
			{ id: 'a', text: 'Cappuccino', correct: false },
			{ id: 'b', text: 'Espresso', correct: true },
			{ id: 'c', text: 'Latte', correct: false }
		]
	}
];

const group2: QuestionType[] = [
	{
		id: 9,
		question: 'Kam Lucie skoro každý víkend jezdila?',
		options: [
			{ id: 'a', text: 'Za rodiči', correct: true },
			{ id: 'b', text: 'Za kamarády', correct: false },
			{ id: 'c', text: 'Na chatu', correct: false }
		]
	},
	{
		id: 10,
		question: 'Co Luciini rodiče rekonstruují?',
		options: [
			{ id: 'a', text: 'Koupelnu', correct: false },
			{ id: 'b', text: 'Kuchyň', correct: true },
			{ id: 'c', text: 'Obývák', correct: false }
		]
	},
	{
		id: 11,
		question: 'Kolik měla rekonstrukce původně stát?',
		options: [
			{ id: 'a', text: '250 tisíc korun', correct: true },
			{ id: 'b', text: '300 tisíc korun', correct: false },
			{ id: 'c', text: '340 tisíc korun', correct: false }
		]
	},
	{
		id: 12,
		question: 'Na kolik se rekonstrukce nakonec vyšplhala?',
		options: [
			{ id: 'a', text: '310 tisíc korun', correct: false },
			{ id: 'b', text: '340 tisíc korun', correct: true },
			{ id: 'c', text: '350 tisíc korun', correct: false }
		]
	},
	{
		id: 13,
		question: 'Co chtěla Luciina máma do nové kuchyně?',
		options: [
			{ id: 'a', text: 'Lepší troubu', correct: true },
			{ id: 'b', text: 'Novou lednici', correct: false },
			{ id: 'c', text: 'Myčku', correct: false }
		]
	},
	{
		id: 14,
		question: 'Co chtěl Luciin táta?',
		options: [
			{ id: 'a', text: 'Dřevěnou pracovní desku', correct: false },
			{ id: 'b', text: 'Kamennou desku', correct: true },
			{ id: 'c', text: 'Nový sporák', correct: false }
		]
	},
	{
		id: 15,
		question: 'Jakou zkušenost zmínil Petr z vlastní rodiny?',
		options: [
			{ id: 'a', text: 'Kuchyně jim vyšla levněji', correct: false },
			{ id: 'b', text: 'Rodičům se koupelna taky prodražila', correct: true },
			{ id: 'c', text: 'Nikdy nic nerekonstruovali', correct: false }
		]
	},
	{
		id: 16,
		question: 'O čem Petr říká, že teď víc přemýšlí?',
		options: [
			{ id: 'a', text: 'O změně práce', correct: false },
			{ id: 'b', text: 'O rovnováze mezi prací, rodinou a koníčky', correct: true },
			{ id: 'c', text: 'O stěhování do jiného města', correct: false }
		]
	},
	{
		id: 17,
		question: 'Jak Petr hodnotí poslední měsíc?',
		options: [
			{ id: 'a', text: 'Byl klidný', correct: false },
			{ id: 'b', text: 'Byl hektický', correct: true },
			{ id: 'c', text: 'Byl nudný', correct: false }
		]
	}
];

const questions = {
	group1,
	group2
};

export default questions;
