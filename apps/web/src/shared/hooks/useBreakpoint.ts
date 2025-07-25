import { useWindowDimensions } from 'react-native'
import { breakpoints, type Breakpoint, type ResponsiveProp } from '@iam/theme'

export function useBreakpoint<T>(responsiveProp: ResponsiveProp<T>): T | undefined {
	const { width } = useWindowDimensions()

	if (responsiveProp == null || typeof responsiveProp !== 'object') {
		return responsiveProp as T
	}

	const typedProp = responsiveProp as Partial<Record<Breakpoint, T>>

	const sorted = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]) as [Breakpoint, number][]

	for (const [key, minWidth] of sorted) {
		if (width >= minWidth && typedProp[key] !== undefined) {
			return typedProp[key]
		}
	}

	return undefined
}
