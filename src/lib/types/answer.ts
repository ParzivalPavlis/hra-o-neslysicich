export type DialogueLineType = {
	speaker: 'M' | 'Ž';
	text: string;
};

export type ConversationOptionType = {
	id: string;
	dialogue: DialogueLineType[];
	correct: boolean;
};

export type AnswerType = {
	id: number;
	videoSrc: string;
	options: AnswerOptionType[];
};

export type VariableAnswerType = {
	id: number;
	videoSrc: string[];
	options: AnswerOptionType[];
};

export type AnswerOptionType = {
	id: string;
	text: string;
	correct: boolean;
};

export type ConversationAnswerType = {
	id: number;
	videoSrc: string;
	options: ConversationOptionType[];
};
