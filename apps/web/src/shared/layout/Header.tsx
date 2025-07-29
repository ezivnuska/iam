// apps/web/src/shared/layout/Header.tsx

import React from 'react'
import { View } from 'react-native'
import { Brand } from '@shared/layout'
import { Button, IconButton } from '@shared/buttons'
import { Avatar } from '@shared/ui'
import { FlexBox } from '@shared/grid'
import { AuthModal } from '@shared/modals'
import { useAuth, useDeviceInfo, useModal, useTheme } from '@shared/hooks'
import { resolveResponsiveProp, Size } from '@iam/theme'
import type { AvatarSize } from '@shared/ui'
import { navigate, useCurrentRoute } from '@shared/navigation'

export const Header: React.FC = () => {
    const { isAuthenticated, isAuthInitialized, user } = useAuth()
    const { showModal } = useModal()
    const { isDark, toggleTheme } = useTheme()
    const { orientation } = useDeviceInfo()
    const currentRoute = useCurrentRoute()

    const isLandscape = orientation === 'landscape'
    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 32, lg: 32 })
    const showLabel = resolveResponsiveProp({ xs: false, sm: false, md: false, lg: true })
    const navSpacing = resolveResponsiveProp({ xs: Size.S, sm: Size.S, md: Size.S, lg: Size.M })
    const avatarSize = resolveResponsiveProp({ xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' }) as AvatarSize

    const showSigninModal = () => showModal(<AuthModal />)
    const gotoProfile = () => navigate('Profile', { screen: 'Main' })
    const gotoUserList = () => navigate('Users', { screen: 'UserList' })

    return (
        <FlexBox
            direction={isLandscape ? 'column' : 'row'}
            justify={isLandscape ? 'flex-start' : 'space-between'}
            align='center'
            spacing={12}
            paddingHorizontal={12}
            paddingVertical={2}
        >
            <Brand />

            <FlexBox
                flex={1}
                direction={isLandscape ? 'column' : 'row-reverse'}
                align={isLandscape ? 'stretch' : 'center'}
                justify={isLandscape ? 'space-between' : 'flex-start'}
            >
                <FlexBox
                    flex={1}
                    direction={isLandscape ? 'column-reverse' : 'row'}
                    spacing={navSpacing}
                    justify={isLandscape ? 'space-between' : 'flex-end'}
                    align={isLandscape ? 'stretch' : 'flex-end'}
                    paddingBottom={isLandscape ? Size.M : 0}
                >
                    <View style={{ alignSelf: 'center' }}>
                        <IconButton
                            iconName={isDark ? 'sunny' : 'moon'}
                            onPress={toggleTheme}
                            iconSize={iconSize - 2}
                        />
                    </View>

                    {isAuthInitialized && (
                        <>
                            {isAuthenticated ? (
                                <FlexBox
                                    direction={isLandscape ? 'column-reverse' : 'row'}
                                    spacing={navSpacing}
                                    align='center'
                                    justify='center'
                                    wrap={false}
                                >
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
                            ) : (
                                <Button label='Sign In' onPress={showSigninModal} />
                            )}
                        </>
                    )}
                </FlexBox>
            </FlexBox>
        </FlexBox>
    )
}
