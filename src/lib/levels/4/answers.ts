import type { AnswerType } from '$types/answer';

export const answers: AnswerType[] = [
	{
		id: 1,
		videoSrc: '/assets/level4/1.mp4',
		options: [
			{
				id: 'a',
				text: 'Jan Novák a narodil jsem se 12. března 1998',
				correct: true
			},
			{
				id: 'b',
				text: 'V posledních dnech mi není úplně dobře',
				correct: false
			},
			{
				id: 'c',
				text: 'Ano, jsem tu poprvé',
				correct: false
			},
			{
				id: 'd',
				text: 'Ne, už jsem tu byl',
				correct: false
			}
		]
	},
	{
		id: 2,
		videoSrc: '/assets/level4/2.mp4',
		options: [
			{
				id: 'a',
				text: 'Odpověď 1',
				correct: false
			},
			{
				id: 'b',
				text: 'Odpověď 2',
				correct: true
			},
			{
				id: 'c',
				text: 'Odpověď 3',
				correct: false
			},
			{
				id: 'd',
				text: 'Odpověď 4',
				correct: false
			}
		]
	},
	{
		id: 3,
		videoSrc: '/assets/level4/3.mp4',
		options: [
			{
				id: 'a',
				text: 'Odpověď 1',
				correct: false
			},
			{
				id: 'b',
				text: 'Odpověď 2',
				correct: true
			},
			{
				id: 'c',
				text: 'Odpověď 3',
				correct: false
			},
			{
				id: 'd',
				text: 'Odpověď 4',
				correct: false
			}
		]
	}
];
