// packages/screens/src/screens/HomeScreen.tsx

import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'
import { Button, SigninForm, SignupForm, PageHeader, PageLayout, Row, Stack } from '@ui'
import { useAuth, useModal } from '@providers'
import { logoutRequest } from '@services'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

export const HomeScreen = () => {
	const navigation = useNavigation<HomeScreenNavProp>()
    const { user, logout, isAuthenticated } = useAuth()
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

    const logoutUser = useCallback(async () => {
        await logoutRequest()
        logout()
		navigation.navigate('Signin')
	}, [navigation])

    const openSigninModal = () => {
        console.log('Opening Signin Modal...')
        showModal(<SigninForm />)
    }
    
    const openSignupModal = () => {
        console.log('Opening Signup Modal...');
        showModal(<SignupForm />)
    }

    const gotoUserList = () => navigation.navigate('UserList')

	return (
		<PageLayout>
			<PageHeader title={`Home${isAuthenticated ? `: ${user?.username}` : ''}`} />
                {/* <Button label='Go to Details' onPress={goToDetails} /> */}
                <Stack spacing={10}>
                    {isAuthenticated
                        ? (
                            <Row spacing={10}>
                                <Button label='Users' onPress={gotoUserList} />
                                <Button label='Sign Out' onPress={logoutUser} />
                            </Row>
                        )
                        : (
                            <Row spacing={10}>
                                <Button label='Sign In' onPress={goToSignin} />
                                <Button label='Sign Up' onPress={goToSignup} />
                            </Row>
                        )
                    }
                </Stack>
		</PageLayout>
	)
}