export type AnswerType = {
	id: number;
	videoSrc: string;
	options: AnswerOptionType[];
};

export type AnswerOptionType = {
	id: string;
	text: string;
	correct: boolean;
};
