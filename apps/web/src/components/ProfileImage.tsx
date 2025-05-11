// app/web/src/components/ProfileImage.tsx

import React from 'react'
import { View, Text, ScrollView, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useAuth } from '../hooks'
import { usePaginatedFetch } from '@services'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'
import { PageLayout } from '../components'

export const ProfileImage = ({
    url,
    username,
    small = false,
}: {
    url?: string,
    username: string,
    small?: boolean
}) => {
    const size = small ? 48 : 120
    return url ? (
        <Image
            source={{ uri: url }}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: '#ddd',
            }}
        />
    ) : (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: '#ccc',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: small ? 20 : 48, color: '#555', fontWeight: 'bold' }}>
                {username?.charAt(0).toUpperCase() || '?'}
            </Text>
        </View>
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