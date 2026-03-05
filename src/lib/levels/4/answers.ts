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
				text: 'Potíže na sobě cítím už poslední 3 dny',
				correct: false
			},
			{
				id: 'b',
				text: 'V posledních dnech mi není úplně dobře, hlavně mě bolí v krku',
				correct: true
			},
			{
				id: 'c',
				text: 'Nejsem alergický na žádné léky',
				correct: false
			},
			{
				id: 'd',
				text: 'Ano, teplotu jsem si naměřil a mám 38 °C',
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
				correct: false
			},
			{
				id: 'c',
				text: 'Odpověď 3',
				correct: false
			},
			{
				id: 'd',
				text: 'Potíže na sobě cítím už poslední 3 dny',
				correct: true
			}
		]
	},
	{
		id: 4,
		videoSrc: '/assets/level4/4.mp4',
		options: [
			{
				id: 'a',
				text: 'Odpověď 1',
				correct: false
			},
			{
				id: 'b',
				text: 'Ano, měřil jsem si ji a měl jsem asi 38 °C',
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
		id: 5,
		videoSrc: '/assets/level4/5.mp4',
		options: [
			{
				id: 'a',
				text: 'Odpověď 1',
				correct: false
			},
			{
				id: 'b',
				text: 'Ano kašel mám, ale je to jen lehký kašel',
				correct: true
			},
			{
				id: 'c',
				text: 'Bolestma hlavy ani únavou netrpím',
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
		id: 6,
		videoSrc: '/assets/level4/6.mp4',
		options: [
			{
				id: 'a',
				text: 'Bolestma hlavy ani únavou netrpím',
				correct: true
			},
			{
				id: 'b',
				text: 'Odpověď 2',
				correct: false
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
		id: 7,
		videoSrc: '/assets/level4/7.mp4',
		options: [
			{
				id: 'a',
				text: 'Odpověď 1',
				correct: false
			},
			{
				id: 'b',
				text: 'Nejsem alergický na žádné léky',
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
