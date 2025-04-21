// packages/screens/src/screens/LoginScreen.tsx

import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@types'
import { Button, LoginForm, PageHeader, PageLayout, Stack } from '@ui'

type LoginScreenNavProp = StackNavigationProp<RootStackParamList, 'Login'>

export const LoginScreen = () => {
	const navigation = useNavigation<LoginScreenNavProp>()

	const goToHome = useCallback(() => {
		navigation.navigate('Home')
	}, [navigation])

	const goToRegister = useCallback(() => {
		navigation.navigate('Register')
	}, [navigation])

	return (
		<PageLayout>
			<PageHeader title='Login' />
            <LoginForm />
            <Stack spacing={10}>
                <Button label='Home' onPress={goToHome} />
                <Button label='Register' onPress={goToRegister} />
            </Stack>
		</PageLayout>
	)
}