// packages/screens/src/screens/UserListScreen.tsx

import React from 'react'
import { View, Text, ScrollView, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { useAuth } from '../hooks'
import { usePaginatedFetch } from '@services'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'
import { PageLayout, UserProfileCard } from '@/components'

type UserListScreenNavProp = StackNavigationProp<RootStackParamList, 'UserList'>

export const UserListScreen = () => {
	const navigation = useNavigation<UserListScreenNavProp>()
	const { user: currentUser } = useAuth()

	const { data, fetchNextPage, loading } = usePaginatedFetch<any>('users')

	if (!currentUser) {
		return (
		<View style={styles.centered}>
			<Text style={styles.loadingText}>Loading profile...</Text>
		</View>
		)
	}

	// Only show other users
	const otherUsers = (data ?? []).filter((u) => u.email !== currentUser.email)

	return (
        <PageLayout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                <FlatList
                    data={otherUsers}
                    keyExtractor={(item) => item.id || item.email}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <UserProfileCard
                            user={item}
                            onPress={() => navigation.navigate('Details', { id: item._id })}
                        />
                    )}
                    onEndReached={fetchNextPage}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
                />
            </ScrollView>
        </PageLayout>
	)
}
  
const styles = StyleSheet.create({
	container: {
		padding: 24,
		alignItems: 'center',
		backgroundColor: '#fff',
		minHeight: '100%',
	},
	profileCard: {
		backgroundColor: '#f9f9f9',
		padding: 24,
		borderRadius: 16,
		alignItems: 'center',
		width: '100%',
		maxWidth: 400,
		marginBottom: 32,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 10,
		elevation: 3,
	},
	username: {
		fontSize: 24,
		fontWeight: '700',
		marginTop: 8,
	},
	email: {
		fontSize: 16,
		color: '#666',
		marginBottom: 8,
	},
	bio: {
		fontSize: 14,
		color: '#777',
		textAlign: 'center',
		marginTop: 8,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		alignSelf: 'flex-start',
		marginBottom: 16,
	},
	otherUserCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fafafa',
		padding: 12,
		borderRadius: 12,
		marginBottom: 12,
		width: '100%',
		maxWidth: 400,
	},
	otherUsername: {
		fontSize: 18,
		fontWeight: '500',
	},
	otherEmail: {
		fontSize: 14,
		color: '#777',
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	loadingText: {
		fontSize: 18,
		color: '#888',
	},
})