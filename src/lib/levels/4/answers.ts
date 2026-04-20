import type { VariableAnswerType } from '$types/answer';

export const answers: VariableAnswerType[] = [
	{
		id: 1,
		videoSrc: ['/assets/level5/normal/1-normal.mp4', '/assets/level5/wrong/1-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: 'Chtěl/a bych si založit spořicí účet',
				correct: true
			},
			{
				id: 'b',
				text: 'Jsem tady poprvé, ještě u vás účet nemám',
				correct: false
			},
			{
				id: 'c',
				text: 'Chtěl/a bych vložit asi padesát tisíc korun',
				correct: false
			},
			{
				id: 'd',
				text: 'Ano prosím, to by se mi hodilo',
				correct: false
			}
		]
	},
	{
		id: 2,
		videoSrc: ['/assets/level5/normal/2-normal.mp4', '/assets/level5/wrong/2-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: 'Chtěl/a bych vložit asi padesát tisíc korun',
				correct: false
			},
			{
				id: 'b',
				text: 'Jsem tady poprvé, ještě u vás účet nemám',
				correct: true
			},
			{
				id: 'c',
				text: 'Ano prosím, to by se mi hodilo',
				correct: false
			},
			{
				id: 'd',
				text: 'Chtěl/a bych zjistit, jaké máte úrokové sazby',
				correct: false
			}
		]
	},
	{
		id: 3,
		videoSrc: ['/assets/level5/normal/3-normal.mp4', '/assets/level5/wrong/3-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: 'Nemám známé, kteří by měli účet u vás',
				correct: false
			},
			{
				id: 'b',
				text: 'Ano prosím, to by se mi hodilo',
				correct: false
			},
			{
				id: 'c',
				text: 'Chtěl/a bych zjistit, jaké máte úrokové sazby',
				correct: false
			},
			{
				id: 'd',
				text: 'Děkuji, ale nemám zájem',
				correct: true
			}
		]
	},
	{
		id: 4,
		videoSrc: ['/assets/level5/normal/4-normal.mp4', '/assets/level5/wrong/4-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: 'Ano prosím, to by se mi hodilo',
				correct: false
			},
			{
				id: 'b',
				text: 'Chtěl/a bych vložit asi padesát tisíc korun',
				correct: true
			},
			{
				id: 'c',
				text: 'Zatím nemám zájem, děkuji',
				correct: false
			},
			{
				id: 'd',
				text: 'Chtěl/a bych zjistit, jaké máte úrokové sazby',
				correct: false
			}
		]
	},
	{
		id: 5,
		videoSrc: ['/assets/level5/normal/5-normal.mp4', '/assets/level5/wrong/5-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: 'Nemám známé, kteří by měli účet u vás',
				correct: false
			},
			{
				id: 'b',
				text: 'Ne, hotovost u sebe nemám',
				correct: true
			},
			{
				id: 'c',
				text: 'Chtěl/a bych zjistit, jaké máte úrokové sazby',
				correct: false
			},
			{
				id: 'd',
				text: 'Ano, kartu bych chtěl/a',
				correct: false
			}
		]
	},
	{
		id: 6,
		videoSrc: ['/assets/level5/normal/6-normal.mp4', '/assets/level5/wrong/6-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: '[Pracovník zmínil úrokovou sazbu 3% ročně]',
				correct: true
			},
			{
				id: 'b',
				text: '[Pracovník zmínil úrokovou sazbu 2% ročně]',
				correct: false
			},
			{
				id: 'c',
				text: '[Pracovník zmínil úrokovou sazbu 4% ročně]',
				correct: false
			},
			{
				id: 'd',
				text: '[Pracovník zmínil úrokovou sazbu 1% ročně]',
				correct: false
			}
		]
	},
	{
		id: 7,
		videoSrc: ['/assets/level5/normal/7-normal.mp4', '/assets/level5/wrong/7-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: 'O to nemám zájem, děkuji',
				correct: false
			},
			{
				id: 'b',
				text: 'Ano prosím, to by se mi hodilo',
				correct: true
			},
			{
				id: 'c',
				text: 'Ano, kartu bych chtěl/a',
				correct: false
			},
			{
				id: 'd',
				text: 'Ne, hotovost u sebe nemám',
				correct: false
			}
		]
	},
	{
		id: 8,
		videoSrc: ['/assets/level5/normal/8-normal.mp4', '/assets/level5/wrong/8-wrong.mp4'],
		options: [
			{
				id: 'a',
				text: 'Ano prosím, to by se mi hodilo',
				correct: false
			},
			{
				id: 'b',
				text: 'Chtěl/a bych si promluvit o podmínkách spořicího účtu',
				correct: false
			},
			{
				id: 'c',
				text: 'Nemám známé, kteří by měli účet u vás',
				correct: false
			},
			{
				id: 'd',
				text: 'Zatím nemám zájem, děkuji',
				correct: true
			}
		]
	}
];
