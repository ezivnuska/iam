// apps/web/src/shared/layout/AuthNav.tsx

import React from 'react'
import { View } from 'react-native'
import { IconButton } from '@shared/buttons'
import { Avatar } from '@shared/ui'
import { FlexBox } from '@shared/grid'
import { useAuth } from '@features/auth'
import { useDeviceInfo } from '@shared/hooks'
import { resolveResponsiveProp, Size } from '@iam/theme'
import type { AvatarSize } from '@shared/ui'
import { navigate, useCurrentRoute } from '@shared/navigation'

export const AuthNav: React.FC = () => {
    const { user } = useAuth()
    const { orientation } = useDeviceInfo()
    const currentRoute = useCurrentRoute()

    const isLandscape = orientation === 'landscape'
    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 32, lg: 32 })
    const showLabel = resolveResponsiveProp({ xs: false, sm: false, md: false, lg: true })
    const navSpacing = resolveResponsiveProp({ xs: Size.S, sm: Size.S, md: Size.S, lg: Size.M })
    const avatarSize = resolveResponsiveProp({ xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' }) as AvatarSize

    const gotoProfile = () => navigate('Profile', { screen: 'Main' })
    const gotoUserList = () => navigate('Users', { screen: 'UserList' })

    return (
        <FlexBox
            direction={isLandscape ? 'column-reverse' : 'row'}
            spacing={navSpacing}
            align='center'
            justify='center'
            wrap={false}
        >
                  
            <IconButton
                label='Memories'
                iconName='time'
                onPress={() => navigate('Memories')}
                iconSize={iconSize - 2}
                active={currentRoute === 'Chat'}
                showLabel={showLabel}
            />

            <IconButton
                label='Chat'
                onPress={() => navigate('Chat')}
                iconName='chatbubbles-outline'
                iconSize={iconSize}
                active={currentRoute === 'Chat'}
                showLabel={showLabel}
            />

            <IconButton
                label='Users'
                onPress={gotoUserList}
                iconName='people-outline'
                iconSize={iconSize}
                active={currentRoute === 'Users'}
                showLabel={showLabel}
            />

            {user && (
                <View style={{ alignSelf: 'center' }}>
                    <Avatar
                        user={user}
                        size={avatarSize}
                        onPress={gotoProfile}
                    />
                </View>
            )}
        </FlexBox>
    )
}
