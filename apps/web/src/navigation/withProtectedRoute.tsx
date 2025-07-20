// apps/web/src/navigation/withProtectedRoute.tsx

import React from 'react'
import { ProtectedRoute } from './ProtectedRoute'

export const withProtectedRoute = <P extends object>(
    Component: React.ComponentType<P>
) => {
    return (props: P) => (
        <ProtectedRoute>
            <Component {...props} />
        </ProtectedRoute>
    )
}
