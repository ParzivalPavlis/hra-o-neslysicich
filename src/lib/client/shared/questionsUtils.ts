import type { QuestionOptionType, QuestionType } from '$types/question';

/**
 * Selects and shuffles answer options for a question.
 * Ensures the correct option is included and randomly selects 2 incorrect options if needed.
 * Returns all 3 options shuffled randomly.
 */
export function selectRandomOptions(options: QuestionOptionType[]) {
	const correctOption = options.find((opt) => opt.correct);
	const incorrectOptions = options.filter((opt) => !opt.correct);

	if (options.length === 3) {
		return [...options].sort(() => 0.5 - Math.random());
	}

	const shuffledIncorrect = [...incorrectOptions].sort(() => 0.5 - Math.random());
	const selectedIncorrect = shuffledIncorrect.slice(0, 2);
	const finalOptions = correctOption ? [correctOption, ...selectedIncorrect] : selectedIncorrect;
	return finalOptions.sort(() => 0.5 - Math.random());
}

// Selects a random subset of questions and randomizes their answer options.
export function selectRandomQuestions(allQuestions: QuestionType[], count: number) {
	const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count).map((q, index) => ({
		...q,
		id: index + 1,
		options: selectRandomOptions(q.options)
	}));
}

/**
 * Extracts a specific number of random question IDs from a source list.
 * Returns an array of IDs that can be stored for later retrieval.
 */
export function pickRandomIds(source: QuestionType[], count: number): number[] {
	return [...source]
		.sort(() => 0.5 - Math.random())
		.slice(0, count)
		.map((q) => q.id);
}

// Reconstructs questions from stored IDs with freshly randomized answer options.
export function buildQuestionsFromIds(allQuestions: QuestionType[], ids: number[]): QuestionType[] {
	return ids
		.map((id) => allQuestions.find((q) => q.id === id))
		.filter((q): q is QuestionType => q !== undefined)
		.map((q, index) => ({
			...q,
			id: index + 1,
			options: selectRandomOptions(q.options)
		}));
}

// Generates a random duration in milliseconds between min and max seconds.
export function getRandomDuration(min: number, max: number): number {
	const randomSeconds = Math.random() * (max - min) + min;
	return randomSeconds * 1000;
}

// Updates a Map with a new key-value pair and returns a new Map instance.
export function updateMap<K, V>(map: Map<K, V>, key: K, value: V): Map<K, V> {
	map.set(key, value);
	return new Map(map);
}

// Deletes a key from a Map and returns a new Map instance.
export function deleteFromMap<K, V>(map: Map<K, V>, key: K): Map<K, V> {
	map.delete(key);
	return new Map(map);
}
