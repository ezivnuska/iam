// apps/web/src/shared/hoc/withProtectedRoute.tsx

import React from 'react'
import { ProtectedRoute } from '../components/ProtectedRoute'

export const withProtectedRoute = <P extends object>(
    Component: React.ComponentType<P>
) => {
    return (props: P) => (
        <ProtectedRoute>
            <Component {...props} />
        </ProtectedRoute>
    )
}
