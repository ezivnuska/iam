// apps/web/src/styles/breakpoints.ts

import { Dimensions } from 'react-native'

export const breakpoints = {
	sm: 0,
	md: 500,
	lg: 900,
} as const

export type Breakpoint = keyof typeof breakpoints

export type ResponsiveProp<T> = T | Partial<Record<Breakpoint, T>>

export function getCurrentBreakpoint(): Breakpoint {
	const { width } = Dimensions.get('window')
	if (width >= breakpoints.lg) return 'lg'
	if (width >= breakpoints.md) return 'md'
	return 'sm'
}

export function resolveResponsiveProp<T>(prop: ResponsiveProp<T>): T {
	if (prop == null || typeof prop !== 'object') return prop as T

	const bp = getCurrentBreakpoint()

	const typedProp = prop as Partial<Record<Breakpoint, T>>

	return (
		typedProp[bp] ??
		typedProp.lg ??
		typedProp.md ??
		typedProp.sm ??
		Object.values(typedProp)[0]
	) as T
}