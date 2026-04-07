import type { QuestionOptionType, QuestionType } from '$types/question';

export function selectRandomOptions(options: QuestionOptionType[]) {
	const correctOption = options.find((opt) => opt.correct);
	const incorrectOptions = options.filter((opt) => !opt.correct);

	// If we have exactly 3 options already, just shuffle and return
	if (options.length === 3) {
		return [...options].sort(() => 0.5 - Math.random());
	}

	// Otherwise, select 2 random incorrect options + the correct one
	const shuffledIncorrect = [...incorrectOptions].sort(() => 0.5 - Math.random());
	const selectedIncorrect = shuffledIncorrect.slice(0, 2);

	// Combine correct + 2 incorrect, then shuffle
	const finalOptions = correctOption ? [correctOption, ...selectedIncorrect] : selectedIncorrect;
	return finalOptions.sort(() => 0.5 - Math.random());
}

// Function to randomly select 6 questions
export function selectRandomQuestions(allQuestions: QuestionType[], count: number) {
	const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count).map((q, index) => ({
		...q,
		id: index + 1, // Reassign IDs to be sequential 1-6
		options: selectRandomOptions(q.options)
	}));
}

// Helper function to get random value within range (in seconds, returns milliseconds)
export function getRandomDuration(min: number, max: number): number {
	const randomSeconds = Math.random() * (max - min) + min;
	return randomSeconds * 1000;
}

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export function updateMap<K, V>(map: Map<K, V>, key: K, value: V): Map<K, V> {
	map.set(key, value);
	return new Map(map);
}

export function getOrientationInfo() {
	const userAgent = navigator.userAgent.toLowerCase();
	const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
	const isPortrait = window.innerHeight > window.innerWidth;
	return { isMobile, isPortrait };
}

export function deleteFromMap<K, V>(map: Map<K, V>, key: K): Map<K, V> {
	map.delete(key);
	return new Map(map);
}
