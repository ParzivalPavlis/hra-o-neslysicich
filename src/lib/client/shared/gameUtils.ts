import { goto } from '$app/navigation';

type VideoGameLevelActions = {
	addAnswer: (questionId: number, selectedOptionId: string, isCorrect: boolean) => void;
	updateCurrentAnswer: (index: number) => void;
	markCompleted: () => void;
	decreaseLives: () => void;
};

type AnswerWithOptions = {
	options: { id: string; correct: boolean }[];
};

export function createAnswerClickHandler(
	levelStore: VideoGameLevelActions,
	levelNumber: number,
	getters: {
		isShowingFeedback: () => boolean;
		getVideos: () => AnswerWithOptions[];
		getCurrentAnswerIndex: () => number;
	},
	setters: {
		setShowingFeedback: (v: boolean) => void;
		setSelectedAnswer: (v: string | null) => void;
		setIsCorrect: (v: boolean) => void;
		setShowAnswerTab: (v: boolean) => void;
		disableButton: (id: string) => void;
	},
	callbacks?: {
		onComplete?: () => void;
	}
) {
	return function handleAnswerClick(optionId: string) {
		if (getters.isShowingFeedback()) return;

		const index = getters.getCurrentAnswerIndex();
		const selectedOption = getters.getVideos()[index].options.find((opt) => opt.id === optionId);
		if (!selectedOption) return;

		const correct = selectedOption.correct;
		setters.setSelectedAnswer(optionId);
		setters.setIsCorrect(correct);
		setters.setShowingFeedback(true);
		levelStore.addAnswer(index, optionId, correct);

		setTimeout(() => {
			if (correct) {
				setters.setShowAnswerTab(false);
				if (index < getters.getVideos().length - 1) {
					levelStore.updateCurrentAnswer(index + 1);
				} else {
					levelStore.markCompleted();
					if (callbacks?.onComplete) {
						callbacks.onComplete();
					} else {
						goto(`/levels/${levelNumber}/overview`);
					}
				}
			} else {
				levelStore.decreaseLives();
				setters.disableButton(optionId);
			}
			setters.setShowingFeedback(false);
			setters.setSelectedAnswer(null);
		}, 1500);
	};
}

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export function isLocalhost() {
	return typeof window !== 'undefined' && window.location.hostname === 'localhost';
}

export function getOrientationInfo() {
	const userAgent = navigator.userAgent.toLowerCase();
	const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
	const isPortrait = window.innerHeight > window.innerWidth;
	return { isMobile, isPortrait };
}
