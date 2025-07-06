// apps/web/src/navigation/withProtectedRoute.tsx

import React from 'react'
import { ProtectedRoute } from './ProtectedRoute'

export const withProtectedRoute = (Component: React.ComponentType) => () => (
	<ProtectedRoute>
		<Component />
	</ProtectedRoute>
)
