import type { ConversationAnswerType } from '$types/answer';

export const answers: ConversationAnswerType[] = [
	{
		id: 1,
		videoSrc: '/assets/level8/konverzace1.mp4',
		options: [
			{
				id: 'a',
				dialogue: [
					{ speaker: 'M', text: 'Chceš jít na metro?' },
					{ speaker: 'Ž', text: 'Ano, rád bych.' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'M', text: 'Co dělání o víkendu?' },
					{ speaker: 'Ž', text: 'Rád chodím.' }
				],
				correct: true
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'M', text: 'Víš, co to je?' },
					{ speaker: 'Ž', text: 'Je to lékař.' }
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
					{ speaker: 'M', text: 'Kde budeš zítra?' },
					{ speaker: 'Ž', text: 'Budu doma.' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'M', text: 'Co děláš?' },
					{ speaker: 'Ž', text: 'Pracuji.' }
				],
				correct: true
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'M', text: 'Jdeš se mnou?' },
					{ speaker: 'Ž', text: 'Spolu jdeš?' }
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
					{ speaker: 'M', text: 'Jaká byla vaše snídaně?' },
					{ speaker: 'Ž', text: 'Byla velmi dobrá.' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'M', text: 'Ztratil jsi něco?' },
					{ speaker: 'Ž', text: 'Ne, nic jsem neztratil.' }
				],
				correct: false
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'M', text: 'Děkuji ti za pomoc.' },
					{ speaker: 'Ž', text: 'Nic se neděje, rád jsem pomohl.' }
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
					{ speaker: 'M', text: 'Dobrý den!' },
					{ speaker: 'Ž', text: 'Dobrý den, jak se máš?' }
				],
				correct: false
			},
			{
				id: 'b',
				dialogue: [
					{ speaker: 'M', text: 'Co dneska děláš?' },
					{ speaker: 'Ž', text: 'Pracuji v kanceláři.' }
				],
				correct: true
			},
			{
				id: 'c',
				dialogue: [
					{ speaker: 'M', text: 'Jak se máš?' },
					{ speaker: 'Ž', text: 'Necítím se dobře.' }
				],
				correct: false
			}
		]
	}
];
