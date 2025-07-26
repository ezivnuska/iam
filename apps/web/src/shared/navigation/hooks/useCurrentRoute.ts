// apps/web/src/shared/navigation/hooks/useCurrentRoute.ts

import { useEffect, useState } from 'react'
import { navigationRef } from '../'

/**
 * Hook to track the current active route name.
 * It listens to navigation state changes and updates automatically.
 */
export const useCurrentRoute = () => {
    const [currentRoute, setCurrentRoute] = useState<string | undefined>(() =>
        navigationRef.isReady() ? navigationRef.getCurrentRoute()?.name : undefined
    )

    useEffect(() => {
        if (!navigationRef.isReady()) return

        const unsubscribe = navigationRef.addListener('state', () => {
            if (navigationRef.isReady()) {
                const route = navigationRef.getCurrentRoute()
                setCurrentRoute(route?.name)
            }
        })
        return unsubscribe
    }, [])

    return currentRoute
}
