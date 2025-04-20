// src/providers/AppProviders.tsx

import { ReactNode } from 'react'
import { AuthProvider } from './auth/AuthProvider'

export const AppProviders = ({ children }: { children: ReactNode }) => (
	<AuthProvider>
		{children}
	</AuthProvider>
)