// apps/web/src/hooks/useCurrentRoute.ts

import { useEffect, useState } from 'react'
import { navigationRef } from '@/navigation'

/**
 * Hook to track the current active route name.
 * It listens to navigation state changes and updates automatically.
 */
export const useCurrentRoute = () => {
    const [currentRoute, setCurrentRoute] = useState<string | undefined>(
        navigationRef.getCurrentRoute()?.name
    )

    useEffect(() => {
        const unsubscribe = navigationRef.addListener('state', () => {
            const route = navigationRef.getCurrentRoute()
            setCurrentRoute(route?.name)
        })
        return unsubscribe
    }, [])

    return currentRoute
}
