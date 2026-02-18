export type TalkingPersonType = {
	name: string;
	thoughts: { text: string; duration: number }[];
	variant: 'man1' | 'man2' | 'woman1' | 'woman2' | 'man1_standing' | 'woman1_standing';
	rotation: 'left' | 'right';
	pauseBetween: { min: number; max: number };
	pauseStart?: number;
};
