// apps/web/src/components/users/UserView.tsx

import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Avatar, Row, UserViewHeader } from '@/components'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { UserProfileNavigator } from '@/navigation'
import type { User, UserStackParamList } from '@iam/types'
import { useTheme } from '@/hooks'
import { useUserProfile } from '@/components'
import { paddingHorizontal, paddingVertical, Size } from '@iam/theme'
import { ImageProvider } from '@/providers'

export const UserView: React.FC<any> = () => {
    const { theme } = useTheme()
    const userToDisplay = useUserProfile()
    const { navigate } = useNavigation<StackNavigationProp<UserStackParamList>>()
    const gotoUser = () => navigate('User', {
        screen: 'UserProfile',
        username: userToDisplay?.username,
    })

	return (
        <ImageProvider>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Row
                    spacing={Size.M}
                    align='center'
                    paddingHorizontal={paddingHorizontal}
                    paddingVertical={paddingVertical}
                >
                    <Pressable onPress={gotoUser}>
                        <Row spacing={15} align='center'>
                            <Avatar user={userToDisplay as User} size='md' />
                            <Text style={{ fontSize: 32, fontWeight: '600', color: theme.colors.text }}>
                                {userToDisplay?.username}
                            </Text>
                        </Row>
                    </Pressable>
                    <UserViewHeader />
                </Row>
                <UserProfileNavigator />
            </View>
        </ImageProvider>
	)
}
