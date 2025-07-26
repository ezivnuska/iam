// apps/web/src/shared/buttons/UserButton.tsx

import React from 'react'
import { Pressable, Text } from 'react-native'
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
        <Pressable onPress={gotoUser}>
            <Row spacing={15} align='center'>
                <Avatar user={userToDisplay as User} size='md' />
                <Text style={{ fontSize: 32, fontWeight: '600', color: theme.colors.text }}>
                    {userToDisplay?.username}
                </Text>
            </Row>
        </Pressable>
	)
}
