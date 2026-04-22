export function isLeftKey(key: string): boolean {
	return key === 'ArrowLeft' || key === 'a' || key === 'A';
}

export function isRightKey(key: string): boolean {
	return key === 'ArrowRight' || key === 'd' || key === 'D';
}

export function preventHorizontalScroll(e: WheelEvent): void {
	if (Math.abs(e.deltaX) > 0) e.preventDefault();
}

export function calcWorldOffset(charWorldX: number, cameraLockPx: number): number {
	return Math.max(0, charWorldX - cameraLockPx);
}

export function calcCharScreenX(charWorldX: number, cameraLockPx: number): number {
	return Math.min(charWorldX, cameraLockPx);
}
