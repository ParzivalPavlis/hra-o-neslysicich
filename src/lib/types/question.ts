export type QuestionType = {
	id: number;
	question: string;
	options: QuestionOptionType[];
};

export type QuestionOptionType = {
	id: string;
	text: string;
	correct: boolean;
};

export type QuestionsArrayType = QuestionType[];
