// apps/web/src/components/layouts/PageLayout/Header.tsx

import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MAX_WIDTH } from './constants'
import { IconButton, ProfileImage, Row, SigninForm } from '@/components'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import { resolveResponsiveProp, Size } from '@/styles'
import { useAuth, useModal } from '@/hooks'
import type { ProfileImageSize } from '@/components'

interface HeaderProps {
    children?: ReactNode
}

const Brand = ({ ...props }) => {
    const fontSize = resolveResponsiveProp({ xs: 32, sm: 34, md: 36, lg: 38 })
    return (
        <Pressable onPress={props.onPress} style={{ flex: 1, flexShrink: 1 }}>
            <Row wrap={true} style={{ flexShrink: 1, minWidth: 50, overflow: 'hidden' }}>
                <Text style={[styles.iam, { fontSize, lineHeight: fontSize }]}>iam</Text>
                {props.showUsername && <Text style={[styles.eric, { fontSize, lineHeight: fontSize }]}>{`${props.user ? props.user.username : 'eric'}`}</Text>}
            </Row>
        </Pressable>
    )
}

export const Header: React.FC<HeaderProps> = (props) => {
    const { logout, isAuthenticated, user } = useAuth()
    const { showModal } = useModal()
    const navigation = useNavigation()

    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 18, lg: 20 })
    const showLabel = resolveResponsiveProp({ xs: false, sm: true, md: true, lg: true })
    const navSpacing = resolveResponsiveProp({ xs: Size.M, sm: Size.M, md: Size.M, lg: Size.L })
    const showUsername = resolveResponsiveProp({ xs: false, sm: true, md: true, lg: true })
    const avatarSize = resolveResponsiveProp({ xs: 'sm', sm: 'md', md: 'md', lg: 'lg' }) as ProfileImageSize

    const currentRoute = useNavigationState((state) => state.routes[state.index].name)

    const showSigninModal = () => showModal(<SigninForm />)

	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    align='center'
                    justify='space-between'
                    wrap={false}
                    style={{ zIndex: 100, flexWrap: 'nowrap' }}
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
                                label='Feed'
                                onPress={() => navigation.navigate('Feed' as never)}
                                icon={<Ionicons name='list' size={iconSize} color='#777' />}
                                active={currentRoute === 'Feed'}
                                showLabel={showLabel}
                            />
                            <IconButton
                                label='Chat'
                                onPress={() => navigation.navigate('Chat' as never)}
                                icon={<Ionicons name='chatbubbles-outline' size={iconSize} color='#777' />}
                                active={currentRoute === 'Chat'}
                                showLabel={showLabel}
                            />
                            <IconButton
                                label='Users'
                                onPress={() => navigation.navigate('UserList' as never)}
                                icon={<Ionicons name='people-outline' size={iconSize} color='#777' />}
                                active={currentRoute === 'UserList'}
                                showLabel={showLabel}
                            />
                            {user && (
                                <ProfileImage
                                    user={user}
                                    size={avatarSize}
                                    onPress={() => navigation.navigate('Profile' as never)}
                                />
                            )}
                        </Row>
                    ) : (
                        <IconButton
                            icon={<AntDesign name='login' size={iconSize} color='#777' />}
                            label='Sign In'
                            onPress={showSigninModal}
                            showLabel={showLabel}
                        />
                    )}
                </Row>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Size.S,
        backgroundColor: '#fff',
    },
    maxWidthContainer: {
        width: '100%',
        maxWidth: MAX_WIDTH,
        marginHorizontal: 'auto',
        paddingHorizontal: Size.M,
    },
	iam: {
		fontWeight: 'bold',
        color: '#000',
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
})