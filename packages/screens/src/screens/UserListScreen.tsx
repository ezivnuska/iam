// packages/screens/src/screens/UserListScreen.tsx

import React, { useCallback } from 'react'
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { usePaginatedFetch } from '@services/hooks/usePaginatedFetch'
import { Button, PageHeader, PageLayout, Row } from '@ui'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParamList } from '@iam/types'

type UserListScreenNavProp = StackNavigationProp<RootStackParamList, 'UserList'>

export const UserListScreen = () => {
	const { data, fetchNextPage, loading } = usePaginatedFetch<any>('users')
    const navigation = useNavigation<UserListScreenNavProp>()
    
    const goToHome = useCallback(() => {
        navigation.navigate('Home')
    }, [navigation])

	return (
        <PageLayout>
                {loading
                ? (
                    <View style={styles.activity}>
                        <ActivityIndicator size={50} />
                    </View>
                )
                : (
                    <FlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        data={data}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={({ item }) => (
                            <View style={{ paddingVertical: 16 }}>
                                <Text>{item.username || JSON.stringify(item)}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        onEndReached={fetchNextPage}
                        onEndReachedThreshold={0.5}
                        // ListFooterComponent={loading ? <ActivityIndicator /> : null}
                    />
                )}
        </PageLayout>
	)
}

const styles = StyleSheet.create({
    activity: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
})

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
