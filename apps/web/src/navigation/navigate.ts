// apps/web/src/navigation/navigate.ts

import { createNavigationContainerRef } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function navigate<RouteName extends keyof RootStackParamList>(
    screen: RouteName,
    ...[params]: RootStackParamList[RouteName] extends undefined
        ? []
        : [params: RootStackParamList[RouteName]]
) {
    if (navigationRef.isReady()) {
        // @ts-ignore - force type to avoid version mismatch
        navigationRef.navigate(screen, ...(params ? [params] : []))
    }
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

// Optional: goBack helper
export function goBack() {
    if (navigationRef.canGoBack()) {
        navigationRef.goBack()
    }
}