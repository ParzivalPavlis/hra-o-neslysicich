import type { LevelButtonType } from '$types/levelButton';
import { Hand, PersonStanding, Speech, Eye } from '@lucide/svelte';

export const levels: LevelButtonType[] = [
	{
		icon: Speech,
		stars: 0,
		locked: false,
		description: 'Sledujte konverzaci ve škole a odpovězte na otázky.',
		href: '/levels/1/intro',
		trails: 3
	},
	{
		icon: Speech,
		stars: 0,
		locked: true,
		description: 'Zachyťte konverzaci v kavárně a odpovězte na otázky',
		href: '/levels/2/intro',
		trails: 5
	},
	{
		icon: Eye,
		stars: 0,
		locked: false,
		description: 'Zkuste si návštěvu u lékaře',
		href: '/levels/3/intro',
		trails: 4
	},
	{
		icon: Eye,
		stars: 0,
		locked: true,
		description: 'Zkuste si návštěvu v bance',
		href: '/levels/4/intro',
		trails: 1
	},
	{
		icon: Hand,
		stars: 0,
		locked: false,
		description: 'Zkuste si znakovou řeč',
		href: '/levels/5/intro',
		trails: 3
	},
	{
		icon: Hand,
		stars: 0,
		locked: true,
		description: 'Porozumějte znakované konverzaci',
		href: '/levels/6/intro',
		trails: 5
	},
	{
		icon: PersonStanding,
		stars: 0,
		locked: true,
		description: 'Kliknutím znovu pro spuštění',
		href: '/levels/7/intro'
	}
];
