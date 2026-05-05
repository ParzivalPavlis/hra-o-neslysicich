import type { AnswerType } from '$types/answer';

export const answers: AnswerType[] = [
	{
		id: 1,
		videoSrc: '/assets/level3/1.mp4',
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
		videoSrc: '/assets/level3/2.mp4',
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
		videoSrc: '/assets/level3/3.mp4',
		options: [
			{
				id: 'a',
				text: 'Ano, teplotu jsem si naměřil a mám 38 °C',
				correct: false
			},
			{
				id: 'b',
				text: 'Bolesti břicha ani průjem nemám',
				correct: false
			},
			{
				id: 'c',
				text: 'Podobné potíže jsem neměl nikdy předtím',
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
		videoSrc: '/assets/level3/4.mp4',
		options: [
			{
				id: 'a',
				text: 'Bolesti břicha ani průjem nemám',
				correct: false
			},
			{
				id: 'b',
				text: 'Ano, měřil jsem si ji a měl jsem asi 38 °C',
				correct: true
			},
			{
				id: 'c',
				text: 'Podobné potíže jsem neměl nikdy předtím',
				correct: false
			},
			{
				id: 'd',
				text: 'Ano, jsem tu poprvé',
				correct: false
			}
		]
	},
	{
		id: 5,
		videoSrc: '/assets/level3/5.mp4',
		options: [
			{
				id: 'a',
				text: 'Nejsem alergický na žádné léky',
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
				text: 'Ne, nikdo v rodině podobné potíže neměl',
				correct: false
			}
		]
	},
	{
		id: 6,
		videoSrc: '/assets/level3/6.mp4',
		options: [
			{
				id: 'a',
				text: 'Bolestma hlavy ani únavou netrpím',
				correct: true
			},
			{
				id: 'b',
				text: 'Ne, nikdo v rodině podobné potíže neměl',
				correct: false
			},
			{
				id: 'c',
				text: 'Podobné potíže jsem neměl nikdy předtím',
				correct: false
			},
			{
				id: 'd',
				text: 'Ano, jsem tu poprvé',
				correct: false
			}
		]
	},
	{
		id: 7,
		videoSrc: '/assets/level3/7.mp4',
		options: [
			{
				id: 'a',
				text: 'Ne, nikdo v rodině podobné potíže neměl',
				correct: false
			},
			{
				id: 'b',
				text: 'Nejsem alergický na žádné léky',
				correct: true
			},
			{
				id: 'c',
				text: 'Podobné potíže jsem neměl nikdy předtím',
				correct: false
			},
			{
				id: 'd',
				text: 'Žádné další příznaky nemám',
				correct: false
			}
		]
	}
];
