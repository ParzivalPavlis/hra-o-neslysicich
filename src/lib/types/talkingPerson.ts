export type TalkingPersonType = {
	name: string;
	dialog: { text?: string; duration: number }[];
	imageSrc: string;
	rotation: 'left' | 'right';
	pauseBetween: { min: number; max: number };
	pauseStart?: number;
};
