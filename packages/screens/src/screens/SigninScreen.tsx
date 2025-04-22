// packages/screens/src/screens/SigninScreen.tsx

import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { Button, SigninForm, PageHeader, PageLayout, Stack } from '@ui'

type SigninScreenNavProp = StackNavigationProp<RootStackParamList, 'Signin'>

export const SigninScreen = () => {
	const navigation = useNavigation<SigninScreenNavProp>()

	const goToHome = useCallback(() => {
		navigation.navigate('Home')
	}, [navigation])

	const goToSignup = useCallback(() => {
		navigation.navigate('Signup')
	}, [navigation])

	return (
		<PageLayout>
			<PageHeader title='Sign Up' />
            <SigninForm />
            <Stack spacing={10}>
                <Button label='Home' onPress={goToHome} />
                <Button label='Sign Up' onPress={goToSignup} />
            </Stack>
		</PageLayout>
	)
}