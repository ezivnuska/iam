// apps/web/src/components/layout/Header.tsx

import React, { ReactNode } from 'react'
import { Pressable, View, Text } from 'react-native'
import { Avatar, Button, IconButton, FlexBox, SigninForm } from '@/components'
import { useAuth, useDeviceInfo, useModal, useTheme } from '@/hooks'
import { resolveResponsiveProp, Size } from '@iam/theme'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import type { AvatarSize } from '@/components'

interface HeaderProps {
    children?: ReactNode
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuth()
	const { openFormModal } = useModal()
    const currentRoute = useNavigationState((state) => state.routes[state.index].name)
	const { isDark, theme, toggleTheme } = useTheme()
    const { orientation } = useDeviceInfo()
    const navigation = useNavigation()
    const isLandscape = orientation === 'landscape'
    const paddingHorizontal = resolveResponsiveProp({ xs: 10, sm: 12, md: 18, lg: 24 })
    const paddingVertical = resolveResponsiveProp({ xs: 4, sm: 8, md: 12, lg: 24 })
    const fontSize = resolveResponsiveProp({ xs: 34, sm: 34, md: 40, lg: 40 })
    const lineHeight = fontSize * 0.9
    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 32, lg: 32 })
    const showLabel = resolveResponsiveProp({ xs: false, sm: false, md: false, lg: true })
    const navSpacing = resolveResponsiveProp({ xs: Size.S, sm: Size.S, md: Size.S, lg: Size.M })
    const avatarSize = resolveResponsiveProp({ xs: 'sm', sm: 'md', md: 'md', lg: 'lg' }) as AvatarSize

    const showSigninModal = () => {
        openFormModal(SigninForm, {}, { title: 'Sign In' })
    }

    return (
        <FlexBox
            direction={isLandscape ? 'column' : 'row'}
            justify={isLandscape ? 'flex-start' : 'space-between'}
            align='center'
            spacing={18}
            paddingHorizontal={paddingHorizontal}
            paddingVertical={paddingVertical}
            style={isLandscape && { width: '20%' }}
        >
            <Pressable
                onPress={() => navigation.navigate('Home' as never)}
            >
                <FlexBox
                    direction='row'
                    wrap={true}
                    justify='center'
                    align='center'
                >
                    <Text style={{ fontSize, lineHeight, color: theme.colors.primary }}>iam</Text>
                    <Text style={{ fontSize, lineHeight, color: theme.colors.secondary }}>eric</Text>
                </FlexBox>
            </Pressable>
            
            <FlexBox
                flex={1}
                direction={isLandscape ? 'column' : 'row-reverse'}
                align={isLandscape ? 'stretch' : 'center'}
                justify={isLandscape ? 'space-between' : 'flex-start'}
                spacing={12}
            >
                <FlexBox
                    flex={1}
                    direction={isLandscape ? 'column-reverse' : 'row'}
                    spacing={navSpacing}
                    justify={isLandscape ? 'space-between' : 'flex-end'}
                    align={isLandscape ? 'stretch' : 'flex-end'}
                >
                    <View style={{ alignSelf: 'center' }}>
                        <IconButton
                            iconName={isDark ? 'sunny' : 'moon'}
                            onPress={toggleTheme}
                            iconSize={iconSize}
                        />
                    </View>
                    
                    {isAuthenticated ? (
                        <FlexBox
                            direction={isLandscape ? 'column-reverse' : 'row'}
                            spacing={navSpacing}
                            align='center'//{isLandscape ? 'flex-start' : 'center'}
                            justify='center'
                            wrap={false}
                        >

                            {children && (
                                <View style={{ alignSelf: isLandscape ? 'flex-start' : 'center' }}>
                                    {children}
                                </View>
                            )}
                            
                            {isLandscape ? (
                                <Button
                                    label='Chat'
                                    onPress={() => navigation.navigate('Chat' as never)}
                                    variant='transparent'
                                />
                            ) : (
                                <IconButton
                                    label='Chat'
                                    onPress={() => navigation.navigate('Chat' as never)}
                                    iconName='chatbubbles-outline'
                                    iconSize={iconSize}
                                    active={currentRoute === 'Chat'}
                                    showLabel={showLabel}
                                />
                            )}

                            {isLandscape ? (
                                <Button
                                    label='Users'
                                    onPress={() => navigation.navigate('UserList' as never)}
                                    variant='transparent'
                                />
                            ) : (
                                <IconButton
                                    label='Users'
                                    onPress={() => navigation.navigate('UserList' as never)}
                                    iconName='people-outline'
                                    iconSize={iconSize}
                                    active={currentRoute === 'UserList'}
                                    showLabel={showLabel}
                                />
                            )}
                            {user && (
                                <View style={{ alignSelf: 'center' }}>
                                    <Avatar
                                        user={user}
                                        size={avatarSize}
                                        onPress={() => navigation.navigate('Profile' as never)}
                                    />
                                </View>
                            )}
                        </FlexBox>
                    ) : (
                        <Button
                            label='Sign In'
                            onPress={() => showSigninModal()}
                        />
                    )}
                </FlexBox>
            </FlexBox>
        </FlexBox>
    )
}