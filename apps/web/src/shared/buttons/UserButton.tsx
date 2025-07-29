// apps/web/src/shared/buttons/UserButton.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Avatar, AvatarSize } from '@shared/ui'
import { Row } from '@shared/grid'
import type { User } from '@iam/types'
import { useTheme } from '@shared/hooks'
import { useUserProfile } from '@features/users'
import { navigate } from '@shared/navigation'
import { resolveResponsiveProp } from '@iam/theme'

interface UserButtonProps {
    user?: User
}

export const UserButton: React.FC<UserButtonProps> = ({ user }) => {
    const { theme } = useTheme()
    const userToDisplay = user || useUserProfile()
    const fontSize = resolveResponsiveProp({ xs: 16, sm: 18, md: 20, lg: 22 })
    const avatarSize = resolveResponsiveProp({ xs: 'xs', sm: 'sm', md: 'sm', lg: 'lg' }) as AvatarSize
    
    const gotoUser = () => navigate('Main' as never)
	
    return (
        <Pressable onPress={gotoUser} style={styles.container}>
            <Row align='center' spacing={8} wrap={false}>
                <Avatar user={userToDisplay as User} size={avatarSize} />
                <Text style={{ fontSize, fontWeight: '600', color: theme.colors.text }}>
                    {userToDisplay?.username}
                </Text>
            </Row>
        </Pressable>
	)
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
    },
})