// packages/screens/src/screens/HomeScreen.tsx

import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { Button, SigninForm, SignupForm, PageHeader, PageLayout, Stack } from '@ui'
import { useModal } from '@providers'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

export const HomeScreen = () => {
	const navigation = useNavigation<HomeScreenNavProp>()
    const { showModal, hideModal } = useModal()

	const goToDetails = useCallback(() => {
		navigation.navigate('Details', { id: '123' })
	}, [navigation])

	const goToSignin = useCallback(() => {
		navigation.navigate('Signin')
	}, [navigation])

    const goToSignup = useCallback(() => {
		navigation.navigate('Signup')
	}, [navigation])

    const openSigninModal = () => {
        console.log('Opening Signin Modal...')
        showModal(<SigninForm />)
    }
    
    const openSignupModal = () => {
        console.log('Opening Signup Modal...');
        showModal(<SignupForm />)
    }

	return (
		<PageLayout>
			<PageHeader title='Home' />
            <Stack spacing={10}>
                <Button label='Go to Details' onPress={goToDetails} />
                <Button label='Sign In' onPress={goToSignin} />
                <Button label='Sign Up' onPress={goToSignup} />
                <Button label='Open Signin Modal' onPress={openSigninModal} />
                <Button label='Open Signup Modal' onPress={openSignupModal} />
            </Stack>
		</PageLayout>
	)
}