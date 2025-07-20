// apps/web/src/components/profile/ProfileView.tsx

import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Button, Avatar, Row, ProfileViewHeader } from '@/components'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { ProfileNavigator } from '@/navigation'
import type { User, ProfileStackParamList, RootStackParamList } from '@iam/types'
import { useAuth, useTheme } from '@/hooks'
import { paddingHorizontal, paddingVertical, Size } from '@iam/theme'
import { ImageProvider } from '@/providers'

export const ProfileView: React.FC<any> = () => {
    const { user, logout } = useAuth()
    const { theme } = useTheme()
    const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>()
    const gotoProfile = () => navigate('Profile', {
            screen: 'Main',
    })

	return (
        <ImageProvider>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Row
                    align='center'
                    justify='space-between'
                >
                    <Row
                        spacing={Size.M}
                        align='center'
                        paddingHorizontal={paddingHorizontal}
                        paddingVertical={paddingVertical}
                    >
                        <Pressable onPress={gotoProfile}>
                            <Row spacing={15} align='center'>
                                <Avatar user={user as User} size='md' />
                                <Text style={{ fontSize: 32, fontWeight: '600', color: theme.colors.text }}>
                                    {user?.username}
                                </Text>
                            </Row>
                        </Pressable>
                        <ProfileViewHeader />
                    </Row>

                    <Button
                        label='Sign Out'
                        onPress={logout}
                        variant='muted'
                    />
                </Row>
                <ProfileNavigator />
            </View>
        </ImageProvider>
	)
}
