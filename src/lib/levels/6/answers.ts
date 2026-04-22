import type { ConversationAnswerType } from '$types/answer';

export const answers: ConversationAnswerType[] = [
	{
		id: 1,
		videoSrc: '/assets/level8/konverzace1.mp4',
		options: [
			{
				id: 'a',
				dialogue: [
					{ speaker: 'M', text: 'Ahoj.' },
					{ speaker: 'Ž', text: 'Ahoj.' },
					{ speaker: 'M', text: 'Jak se máš?' },
					{ speaker: 'Ž', text: 'Mám se špatně.' },
					{ speaker: 'M', text: 'Co budeš dneska dělat?' },
					{ speaker: 'Ž', text: 'Půjdu do práce.' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'M', text: 'Ahoj.' },
					{ speaker: 'Ž', text: 'Ahoj.' },
					{ speaker: 'M', text: 'Jak se máš?' },
					{ speaker: 'Ž', text: 'Mám se dobře.' },
					{ speaker: 'M', text: 'Co jsi dneska dělala?' },
					{ speaker: 'Ž', text: 'Byla jsem v práci.' }
				],
				correct: true
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'M', text: 'Ahoj.' },
					{ speaker: 'Ž', text: 'Ahoj.' },
					{ speaker: 'M', text: 'Jak se máš?' },
					{ speaker: 'Ž', text: 'Mám se dobře.' },
					{ speaker: 'M', text: 'Co budeš dneska dělat?' },
					{ speaker: 'Ž', text: 'Půjdu do práce.' }
				],
				correct: false
			}
		]
	},
	{
		id: 2,
		videoSrc: '/assets/level8/konverzace2.mp4',
		options: [
			{
				id: 'a',
				dialogue: [
					{ speaker: 'M', text: 'Ahoj.' },
					{ speaker: 'Ž', text: 'Ahoj.' },
					{ speaker: 'M', text: 'Jak ti je?' },
					{ speaker: 'Ž', text: 'Necítím se dobře.' },
					{ speaker: 'M', text: 'Aha, tak pujdeme spolu domů.' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'M', text: 'Ahoj.' },
					{ speaker: 'Ž', text: 'Ahoj.' },
					{ speaker: 'M', text: 'Jak ti je?' },
					{ speaker: 'Ž', text: 'Necítím se dobře.' },
					{ speaker: 'M', text: 'Aha, tak pujdeme spolu k lékaři.' }
				],
				correct: true
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'M', text: 'Ahoj.' },
					{ speaker: 'Ž', text: 'Ahoj.' },
					{ speaker: 'M', text: 'Jak ti je?' },
					{ speaker: 'Ž', text: 'Jsem unavená.' },
					{ speaker: 'M', text: 'Aha, tak pujdeme spolu k domů.' }
				],
				correct: false
			}
		]
	},
	{
		id: 3,
		videoSrc: '/assets/level8/konverzace3.mp4',
		options: [
			{
				id: 'a',
				dialogue: [
					{ speaker: 'Ž', text: 'Dobrý den.' },
					{ speaker: 'M', text: 'Dobrý den.' },
					{ speaker: 'Ž', text: 'Chceš udělat snídani?' },
					{ speaker: 'M', text: 'Ano, prosím uděláš mi vejce?' },
					{ speaker: 'Ž', text: 'Dobře, udělám ti.' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'Ž', text: 'Dobré ráno.' },
					{ speaker: 'M', text: 'Dobré ráno.' },
					{ speaker: 'Ž', text: 'Chceš udělat oběd?' },
					{ speaker: 'M', text: 'Ano, prosím uděláš mi míchané vejce?' },
					{ speaker: 'Ž', text: 'Dobře, udělám ti.' }
				],
				correct: false
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'Ž', text: 'Dobré ráno.' },
					{ speaker: 'M', text: 'Dobré ráno.' },
					{ speaker: 'Ž', text: 'Chceš udělat snídani?' },
					{ speaker: 'M', text: 'Ano, prosím uděláš mi míchané vejce?' },
					{ speaker: 'Ž', text: 'Dobře, udělám ti.' }
				],
				correct: true
			}
		]
	},
	{
		id: 4,
		videoSrc: '/assets/level8/konverzace4.mp4',
		options: [
			{
				id: 'a',
				dialogue: [
					{ speaker: 'M', text: 'Dobré ráno.' },
					{ speaker: 'Ž', text: 'Dobré ráno.' },
					{ speaker: 'M', text: 'Kde je míchané vejce za rohem?' },
					{ speaker: 'Ž', text: 'Je v metru, chodit tam spolu.' },
					{ speaker: 'M', text: 'Co budeš dneska dělat?' },
					{ speaker: 'Ž', text: 'Děkuji, na shledanou!' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'Ž', text: 'Dobrý den.' },
					{ speaker: 'M', text: 'Dobrý den.' },
					{ speaker: 'Ž', text: 'Ztratila jsem se, kde je metro?' },
					{ speaker: 'M', text: 'Metro je za rohem.' },
					{ speaker: 'Ž', text: 'Děkuji, na shlednaou.' },
					{ speaker: 'M', text: 'Na shledanou.' }
				],
				correct: true
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'M', text: 'Dobrý den.' },
					{ speaker: 'Ž', text: 'Dobrý den.' },
					{ speaker: 'M', text: 'Ztratila jsem se, kde je lékař?' },
					{ speaker: 'Ž', text: 'Metro je za rohem, chodit tam spolu.' },
					{ speaker: 'M', text: 'Co budeš dneska?' },
					{ speaker: 'Ž', text: 'Děkuji, na shledanou!' }
				],
				correct: false
			}
		]
	}
];
