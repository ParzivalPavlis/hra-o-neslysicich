import type { LevelButtonType } from '$types/levelButton';
import { Hand, PersonStanding, Speech, Stethoscope } from '@lucide/svelte';

export const levels: LevelButtonType[] = [
	{
		icon: Speech,
		stars: 0,
		locked: false,
		description: 'Zachyťte konverzaci v kavárně a odpovězte na otázky',
		href: '/levels/1/intro',
		trails: 3
	},
	{
		icon: Speech,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/2',
		trails: 5
	},
	{
		icon: Speech,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/3',
		trails: 2
	},
	{
		icon: Stethoscope,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/4',
		trails: 4
	},
	{
		icon: Stethoscope,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/5',
		trails: 1
	},
	{
		icon: Stethoscope,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/6',
		trails: 6
	},
	{
		icon: Hand,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/7',
		trails: 3
	},
	{
		icon: Hand,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/8',
		trails: 5
	},
	{
		icon: Hand,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/9',
		trails: 2
	},
	{
		icon: PersonStanding,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/10',
		trails: 5
	},
	{
		icon: PersonStanding,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/11',
		trails: 4
	},
	{
		icon: PersonStanding,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/12'
	}
];
