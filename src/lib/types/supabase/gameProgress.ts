export type GameProgressType = {
	levels: {
		level1: LevelProgressType;
		level2: LevelProgressType;
		level3: LevelProgressType;
		level4: LevelProgressType;
		level5: LevelProgressType;
		level6: LevelProgressType;
		level7: LevelProgressType;
		level8: LevelProgressType;
		level9: LevelProgressType;
		level10: LevelProgressType;
		level11: LevelProgressType;
		level12: LevelProgressType;
	};
};

export type LevelProgressType = {
	stars: 0 | 1 | 2 | 3;
	completed: boolean;
};
