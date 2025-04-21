// packages/screens/src/screens/HomeScreen.tsx

import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@types'
import { Button, PageHeader, PageLayout, Stack } from '@ui'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

export const HomeScreen = () => {
	const navigation = useNavigation<HomeScreenNavProp>()

	const goToDetails = useCallback(() => {
		navigation.navigate('Details', { id: '123' })
	}, [navigation])

	const goToLogin = useCallback(() => {
		navigation.navigate('Login')
	}, [navigation])

    const goToRegister = useCallback(() => {
		navigation.navigate('Register')
	}, [navigation])

	return (
		<PageLayout>
			<PageHeader title='Home' />
            <Stack spacing={10}>
                <Button label='Go to Details' onPress={goToDetails} />
                <Button label='Login' onPress={goToLogin} />
                <Button label='Register' onPress={goToRegister} />
            </Stack>
		</PageLayout>
	)
}