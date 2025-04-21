// packages/screens/src/screens/RegisterScreen.tsx

import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@types'
import { Button, PageHeader, PageLayout, RegisterForm, Stack } from '@ui'

type RegisterScreenNavProp = StackNavigationProp<RootStackParamList, 'Register'>

export const RegisterScreen = () => {
	const navigation = useNavigation<RegisterScreenNavProp>()

	const goToHome = useCallback(() => {
		navigation.navigate('Home')
	}, [navigation])

	const goToLogin = useCallback(() => {
		navigation.navigate('Login')
	}, [navigation])

	return (
		<PageLayout>
			<PageHeader title='Register' />
            <RegisterForm />
            <Stack spacing={10}>
                <Button label='Home' onPress={goToHome} />
                <Button label='Login' onPress={goToLogin} />
            </Stack>
		</PageLayout>
	)
}