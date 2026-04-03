export interface LevelAnswersState {
	questionId: number;
	selectedOptionId: string;
	isCorrect: boolean;
}

export interface LevelQuestionsState {
	questionIds: number[];
	currentQuestionIndex: number;
	answers: LevelAnswersState[];
}

export interface LevelVideosState {
	currentAnswerIndex: number;
	lives: number;
	answers: LevelAnswersState[];
}
