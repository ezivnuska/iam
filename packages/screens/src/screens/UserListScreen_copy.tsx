// // packages/screens/src/screens/UserListScreen.tsx

// import React from 'react'
// import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
// import { useNavigation } from '@react-navigation/native'
// import { usePaginatedFetch } from '@services/hooks/usePaginatedFetch'
// import { PageLayout } from '@ui'
// import type { StackNavigationProp } from '@react-navigation/stack'
// import type { RootStackParamList } from '@iam/types'

// type UserListScreenNavProp = StackNavigationProp<RootStackParamList, 'UserList'>

// export const UserListScreen = () => {

// 	const { data, fetchNextPage, loading } = usePaginatedFetch<any>('users')
//     const navigation = useNavigation<UserListScreenNavProp>()
    
//     const goToDetails = (id: string) => {
//         console.log('id', id)
//         navigation.navigate('Details', { id })
//     }

// 	return (
//         <PageLayout>
//             <View style={styles.container}>
//                 <FlatList
//                     style={{ flex: 1 }}
//                     contentContainerStyle={{ flexGrow: 1 }}
//                     data={data}
//                     keyExtractor={(item, index) => `user-list-item-${item.username}`}
//                     renderItem={({ item }) => (
//                         <Pressable
//                             style={styles.listItem}
//                             onPress={() => goToDetails(item._id)}
//                         >
//                             <Text>{item.username || JSON.stringify(item)}</Text>
//                         </Pressable>
//                     )}
//                     showsVerticalScrollIndicator={false}
//                     onEndReached={fetchNextPage}
//                     onEndReachedThreshold={0.5}
//                     ListFooterComponent={loading ? <ActivityIndicator /> : null}
//                 />
//             </View>
//         </PageLayout>
// 	)
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%',
//     },
//     listItem: {
//         paddingVertical: 16,
//     },
// })

// // import React, { useCallback } from 'react'
// // import { View } from 'react-native'
// // import { useNavigation } from '@react-navigation/native'
// // import type { StackNavigationProp } from '@react-navigation/stack'
// // import type { RootStackParamList } from '@iam/types'
// // import { Button, SigninForm, SignupForm, PageHeader, PageLayout, Row, Stack, PaginatedList } from '@ui'
// // import { useModal } from '@providers'

// // type UserListScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>

// // export const UserListScreen = () => {
// // 	const navigation = useNavigation<UserListScreenNavProp>()
// //     const { showModal, hideModal } = useModal()

// // 	const goToDetails = useCallback(() => {
// // 		navigation.navigate('Details', { id: '123' })
// // 	}, [navigation])

// // 	const goToSignin = useCallback(() => {
// // 		navigation.navigate('Signin')
// // 	}, [navigation])

// //     const goToSignup = useCallback(() => {
// // 		navigation.navigate('Signup')
// // 	}, [navigation])

// //     const openSigninModal = () => {
// //         console.log('Opening Signin Modal...')
// //         showModal(<SigninForm />)
// //     }
    
// //     const openSignupModal = () => {
// //         console.log('Opening Signup Modal...');
// //         showModal(<SignupForm />)
// //     }

// // 	return (
// // 		<PageLayout>
// // 			<PageHeader title='Home' />
// //             <Row spacing={10}>
// //                 <Button label='Go to Details' onPress={goToDetails} />
// //                 <Button label='Sign In' onPress={goToSignin} />
// //                 <Button label='Sign Up' onPress={goToSignup} />
// //                 <Button label='Open Signin Modal' onPress={openSigninModal} />
// //                 <Button label='Open Signup Modal' onPress={openSignupModal} />
// //             </Row>
// //                 <PaginatedList />
// // 		</PageLayout>
// // 	)
// // }
