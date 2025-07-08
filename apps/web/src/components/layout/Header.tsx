// apps/web/src/components/layout/Header.tsx

import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MAX_WIDTH } from './constants'
import { AuthModal, Avatar, IconButton, Row } from '@/components'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import { useAuth, useModal } from '@/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'
import type { AvatarSize } from '@/components'
import { paddingHorizontal, resolveResponsiveProp, Size } from '@/styles'
import { AuthMode } from '@/components/forms'

interface HeaderProps {
    children?: ReactNode
}

const Brand = ({ ...props }) => {
    const fontSize = resolveResponsiveProp({ xs: 34, sm: 34, md: 36, lg: 40 })
    return (
        <Pressable onPress={props.onPress} style={{ flex: 1, flexShrink: 1 }}>
            <Row wrap={true} style={{ flexShrink: 1, minWidth: 50, overflow: 'hidden' }}>
                <Text style={[styles.iam, { fontSize, lineHeight: fontSize }]}>iam</Text>
                {props.showUsername && <Text style={[styles.eric, { fontSize, lineHeight: fontSize }]}>{`${props.user ? props.user.username : 'eric'}`}</Text>}
            </Row>
        </Pressable>
    )
}

export const Header: React.FC<HeaderProps> = () => {
    const { isAuthenticated, user, authenticate } = useAuth()
    const { showModal } = useModal()
    const navigation = useNavigation()

    const iconSize = resolveResponsiveProp({ xs: 24, sm: 18, md: 18, lg: 20 })
    const showLabel = resolveResponsiveProp({ xs: false, sm: true, md: true, lg: true })
    const navSpacing = resolveResponsiveProp({ xs: Size.M, sm: Size.M, md: Size.M, lg: Size.L })
    const showUsername = resolveResponsiveProp({ xs: false, sm: true, md: true, lg: true })
    const avatarSize = resolveResponsiveProp({ xs: 'sm', sm: 'md', md: 'md', lg: 'lg' }) as AvatarSize

    const currentRoute = useNavigationState((state) => state.routes[state.index].name)

    const showAuthModal = (mode: AuthMode) => {
        showModal(<AuthModal initialMode={mode} authenticate={authenticate} />)
    }

	return (
        <Row flex={1} align='center' style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    align='center'
                    justify='space-between'
                    wrap={false}
                    style={{
                        zIndex: 100,
                        flexWrap: 'nowrap',
                        // minHeight: 50,
                    }}
                >
                    <Brand
                        user={user}
                        onPress={() => navigation.navigate('Home' as never)}
                        showUsername={showUsername}
                    />

                    {isAuthenticated ? (
                        <Row
                            flex={5}
                            spacing={navSpacing}
                            align='center'
                            justify='center'
                            wrap={false}
                            style={styles.nav}
                        >
                            <IconButton
                                label='Chat'
                                onPress={() => navigation.navigate('Chat' as never)}
                                icon={<Ionicons name='chatbubbles-outline' size={iconSize} color='#ccc' />}
                                active={currentRoute === 'Chat'}
                                showLabel={showLabel}
                            />
                            <IconButton
                                label='Users'
                                onPress={() => navigation.navigate('UserList' as never)}
                                icon={<Ionicons name='people-outline' size={iconSize} color='#ccc' />}
                                active={currentRoute === 'UserList'}
                                showLabel={showLabel}
                            />
                            {user && (
                                <Avatar
                                    user={user}
                                    size={avatarSize}
                                    onPress={() => navigation.navigate('Profile' as never)}
                                />
                            )}
                        </Row>
                    ) : (
                        <Row spacing={1} style={styles.authButtons}>
                            <Pressable onPress={() => showAuthModal('signup')} style={[styles.authButton, { borderRightWidth: 1, borderRightColor: '#aaa' }]}>
                                <Text style={styles.buttonLabel}>Sign Up</Text>
                            </Pressable>
                            <Pressable onPress={() => showAuthModal('signin')} style={[styles.authButton, { paddingRight: 0 }]}>
                                <Text style={styles.buttonLabel}>Sign In</Text>
                            </Pressable>
                        </Row>
                    )}
                </Row>
            </View>
        </Row>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: Size.XS,
    },
    maxWidthContainer: {
        flex: 1,
        width: '100%',
        maxWidth: MAX_WIDTH,
        marginHorizontal: 'auto',
        paddingHorizontal: paddingHorizontal,
    },
	iam: {
		fontWeight: 'bold',
        color: '#fff',
	},
	eric: {
		fontWeight: 'bold',
        color: '#777',
	},
    nav: {
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 'auto',
    },
    authButtons: {
        
    },
    authButton: {
        paddingHorizontal: Size.XS,
    },
    buttonLabel: {
        color: '#fff',
    },
})