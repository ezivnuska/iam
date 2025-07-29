// packages/theme/src/spacing.ts

export const spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
}

export enum Size {
	None = 0,
	XS = 4,
	S = 12,
	M = 14,
	L = 16,
	XL = 32,
}

export type GridValue = Size | 0

export const getSpacing = (value: Size | number = Size.S) => value
