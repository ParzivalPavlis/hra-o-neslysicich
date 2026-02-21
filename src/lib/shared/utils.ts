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
