// packages/screens/src/screens/RegisterScreen.tsx

import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { Button, PageHeader, PageLayout, SignupForm, Stack } from '@ui'

type SignupScreenNavProp = StackNavigationProp<RootStackParamList, 'Signup'>

export const SignupScreen = () => {
	const navigation = useNavigation<SignupScreenNavProp>()

	const goToHome = useCallback(() => {
		navigation.navigate('Home')
	}, [navigation])

	const goToSignin = useCallback(() => {
		navigation.navigate('Signin')
	}, [navigation])

	return (
		<PageLayout>
			<PageHeader title='Sign In' />
            <SignupForm />
            <Stack spacing={10}>
                <Button label='Home' onPress={goToHome} />
                <Button label='Sign In' onPress={goToSignin} />
            </Stack>
		</PageLayout>
	)
}