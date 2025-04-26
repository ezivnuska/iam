// packages/screens/src/screens/HomeScreen.tsx

// apps/web/src/screens/HomeScreen.tsx

import React, { useCallback } from 'react'
import { FlatList, Text, View, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { usePaginatedFetch } from '@services/hooks/usePaginatedFetch'
import { Button, PageLayout, Row } from '@ui'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type UserListScreenNavProp = StackNavigationProp<RootStackParamList, 'UserList'>

export const UserListScreen = () => {
	const { data, fetchNextPage, loading } = usePaginatedFetch<any>('users')
    console.log('data', data)
    const navigation = useNavigation<UserListScreenNavProp>()
    
    const goToHome = useCallback(() => {
        navigation.navigate('Home')
    }, [navigation])

	return (
        <PageLayout>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ padding: 16 }}>
                            <Text>{item.username || JSON.stringify(item)}</Text>
                        </View>
                    )}
                    onEndReached={fetchNextPage}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator /> : null}
                />
            </View>
            <Row spacing={10}>
                <Button label='Home' onPress={goToHome} />
            </Row>

        </PageLayout>
	)
}


// import React, { useCallback } from 'react'
// import { View } from 'react-native'
// import { useNavigation } from '@react-navigation/native'
// import type { StackNavigationProp } from '@react-navigation/stack'
// import type { RootStackParamList } from '@iam/types'
// import { Button, SigninForm, SignupForm, PageHeader, PageLayout, Row, Stack, PaginatedList } from '@ui'
// import { useModal } from '@providers'

// type UserListScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

// export const UserListScreen = () => {
// 	const navigation = useNavigation<UserListScreenNavProp>()
//     const { showModal, hideModal } = useModal()

// 	const goToDetails = useCallback(() => {
// 		navigation.navigate('Details', { id: '123' })
// 	}, [navigation])

// 	const goToSignin = useCallback(() => {
// 		navigation.navigate('Signin')
// 	}, [navigation])

//     const goToSignup = useCallback(() => {
// 		navigation.navigate('Signup')
// 	}, [navigation])

//     const openSigninModal = () => {
//         console.log('Opening Signin Modal...')
//         showModal(<SigninForm />)
//     }
    
//     const openSignupModal = () => {
//         console.log('Opening Signup Modal...');
//         showModal(<SignupForm />)
//     }

// 	return (
// 		<PageLayout>
// 			<PageHeader title='Home' />
//             <Row spacing={10}>
//                 <Button label='Go to Details' onPress={goToDetails} />
//                 <Button label='Sign In' onPress={goToSignin} />
//                 <Button label='Sign Up' onPress={goToSignup} />
//                 <Button label='Open Signin Modal' onPress={openSigninModal} />
//                 <Button label='Open Signup Modal' onPress={openSignupModal} />
//             </Row>
//                 <PaginatedList />
// 		</PageLayout>
// 	)
// }