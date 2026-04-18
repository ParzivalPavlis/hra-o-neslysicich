export interface AnswersState {
	questionId: number;
	selectedOptionId: string;
	isCorrect: boolean;
}

export interface LevelQuestionsState {
	questionIds: number[];
	completed: boolean;
	currentQuestionIndex: number;
	answers: AnswersState[];
}

export interface LevelVideosState {
	currentAnswerIndex: number;
	completed: boolean;
	lives: number;
	answers: AnswersState[];
}
