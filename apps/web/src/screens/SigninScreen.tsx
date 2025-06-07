// packages/screens/src/screens/SigninScreen.tsx

import React from 'react'
import { SigninForm, PageLayout } from '../components'
import { useAuth } from '@/hooks'

export const SigninScreen = () => {
    const { user, login } = useAuth()
	return (
		<PageLayout>
            <SigninForm user={user} login={login} />
		</PageLayout>
	)
}