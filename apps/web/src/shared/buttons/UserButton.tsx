// apps/web/src/shared/buttons/UserButton.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Avatar } from '@shared/ui'
import { Row } from '@shared/grid'
import type { User } from '@iam/types'
import { useTheme } from '@shared/hooks'
import { useUserProfile } from '@features/users'
import { navigate } from '@shared/navigation'

interface UserButtonProps {
    user?: User
}

export const UserButton: React.FC<UserButtonProps> = ({ user }) => {
    const { theme } = useTheme()
    const userToDisplay = user || useUserProfile()

    const gotoUser = () => navigate('Main' as never)
	
    return (
        <Pressable onPress={gotoUser} style={[styles.container, { borderColor: theme.colors.muted, }]}>
            <Row align='center'>
                <Avatar user={userToDisplay as User} size='sm' />
                <Text style={{ paddingHorizontal: 8, fontSize: 32, fontWeight: '600', color: theme.colors.text }}>
                    {userToDisplay?.username}
                </Text>
            </Row>
        </Pressable>
	)
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
        borderWidth: 1,
        borderRadius: 20,
    },
})