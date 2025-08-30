// apps/web/src/shared/navigation/utils/navigate.ts

import { createNavigationContainerRef } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

/**
 * Type-safe navigate helper with optional params.
 */
export function navigate<RouteName extends keyof RootStackParamList>(
	screen: RouteName,
	params?: RootStackParamList[RouteName]
) {
	if (navigationRef.isReady()) {
		navigationRef.navigate(screen as any, params as any)
	}
}

export function getCurrentRouteName() {
    if (navigationRef.isReady()) {
        return navigationRef.getCurrentRoute()?.name
    }
    return null
}

export function resetTo<RouteName extends keyof RootStackParamList>(
	screen: RouteName,
	params?: RootStackParamList[RouteName]
) {
	if (navigationRef.isReady()) {
		navigationRef.reset({
		index: 0,
		routes: [
			params !== undefined
			? { name: screen, params }
			: { name: screen },
		],
		})
	}
}

export function goBack() {
	if (navigationRef.canGoBack()) {
		navigationRef.goBack()
	}
}
