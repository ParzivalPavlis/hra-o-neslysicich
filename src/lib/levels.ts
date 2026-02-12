import type { LevelButtonType } from '$types/levelButton';
import { Hand, PersonStanding, Speech, Stethoscope } from '@lucide/svelte';

export const levels: LevelButtonType[] = [
	{
		icon: Speech,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění adad ad aaddada adda a d',
		trails: 3
	},
	{
		icon: Speech,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 5
	},
	{
		icon: Speech,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 2
	},
	{
		icon: Stethoscope,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 4
	},
	{
		icon: Stethoscope,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 1
	},
	{
		icon: Stethoscope,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 6
	},
	{
		icon: Hand,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 3
	},
	{
		icon: Hand,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 5
	},
	{
		icon: Hand,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 2
	},
	{
		icon: PersonStanding,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 5
	},
	{
		icon: PersonStanding,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění',
		trails: 4
	},
	{
		icon: PersonStanding,
		stars: 0,
		locked: false,
		description: 'Kliknutím znovu pro spuštění'
	}
];
