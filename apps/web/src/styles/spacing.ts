// apps/web/src/styles/spacing.ts

export enum Size {
	None = 0,
	XS = 4,
	S = 8,
	M = 16,
	L = 24,
	XL = 32,
}

export type GridValue = Size | 0

export const getSpacing = (value: Size | number = Size.S) => value
