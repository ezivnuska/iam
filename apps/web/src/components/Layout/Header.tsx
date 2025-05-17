// apps/web/src/components/layouts/PageLayout/Header.tsx

import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MAX_WIDTH } from './constants'
import { IconButton, ProfileImage, Row, SigninForm } from '@/components'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import { resolveResponsiveProp } from '@/styles'
import { useAuth, useModal } from '@/hooks'

interface HeaderProps {
    children?: ReactNode
}

const Brand = ({ ...props }) => (
    <Pressable onPress={props.onPress} style={{ flexShrink: 1 }}>
        <Row spacing={10} style={{ flexShrink: 1, flexWrap: 'nowrap' }} wrap={false}>
            {props.showAvatar && props.user && (
                <ProfileImage
                    url={props.user.avatar?.url}
                    username={props.user.username}
                    size={props.size}
                />
            )}
            <Row wrap={true} style={{ flexShrink: 1, minWidth: 50 }}>
                <Text style={styles.iam}>iam</Text>
                {props.showUsername && <Text style={styles.eric}>{`${props.user ? props.user.username : 'eric'}`}</Text>}
            </Row>
        </Row>
    </Pressable>
)

export const Header: React.FC<HeaderProps> = (props) => {
    const { logout, isAuthenticated, user } = useAuth()
    const { showModal } = useModal()
    const navigation = useNavigation()

    const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })
    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 18, lg: 18 })
    const showLabel = resolveResponsiveProp({ xs: false, sm: true, md: true, lg: true })
    const navSpacing = resolveResponsiveProp({ xs: 12, sm: 12, md: 24, lg: 48 })
    const showUsername = resolveResponsiveProp({ xs: false, sm: false, md: true, lg: true })
    const showAvatar = resolveResponsiveProp({ xs: true, sm: true, md: true, lg: true })
    const avatarSize = resolveResponsiveProp({ xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' })

    const currentRoute = useNavigationState((state) => state.routes[state.index].name)

    const showSigninModal = () => showModal(<SigninForm />)

	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    spacing={25}
                    align='center'
                    justify='space-between'
                    paddingHorizontal={paddingHorizontal}
                    wrap={false}
                    style={{ zIndex: 100, flexWrap: 'nowrap' }}
                >
                    <Brand
                        user={user}
                        onPress={() => navigation.navigate('Home' as never)}
                        showUsername={showUsername}
                        showAvatar={showAvatar}
                        size={avatarSize}
                    />

                    {isAuthenticated && (
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
                                icon={<Ionicons name='list' size={iconSize} color='white' />}
                                active={currentRoute === 'Feed'}
                                showLabel={showLabel}
                            />
                            <IconButton
                                label='Chat'
                                onPress={() => navigation.navigate('Chat' as never)}
                                icon={<Ionicons name='chatbubbles-outline' size={iconSize} color='white' />}
                                active={currentRoute === 'Chat'}
                                showLabel={showLabel}
                            />
                            <IconButton
                                label='Users'
                                onPress={() => navigation.navigate('UserList' as never)}
                                icon={<Ionicons name='people-outline' size={iconSize} color='white' />}
                                active={currentRoute === 'UserList'}
                                showLabel={showLabel}
                            />
                            <IconButton
                                label='Profile'
                                onPress={() => navigation.navigate('Profile' as never)}
                                icon={<Ionicons name='person-circle-outline' size={iconSize} color='white' />}
                                active={currentRoute === 'Profile'}
                                showLabel={showLabel}
                            />
                        </Row>
                    )}

                    {isAuthenticated
                        ? (  
                            <IconButton
                                icon={<Ionicons name='exit-outline' size={iconSize} color='white' />}
                                label='Sign Out'
                                onPress={logout}
                                showLabel={showLabel}
                            />
                        )
                        : (
                            <IconButton
                                icon={<AntDesign name='login' size={iconSize} color='white' />}
                                label='Sign In'
                                onPress={showSigninModal}
                                showLabel={showLabel}
                            />
                        )
                    }
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
        paddingVertical: 10,
        backgroundColor: '#000',
    },
    maxWidthContainer: {
        width: '100%',
        maxWidth: MAX_WIDTH,
        alignSelf: 'center',
        marginHorizontal: 'auto',
    },
	iam: {
		fontSize: 28,
		fontWeight: 'bold',
        color: '#fff',
	},
	eric: {
		fontSize: 28,
		fontWeight: 'bold',
        color: '#ddd',
	},
    nav: {
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 'auto',
    },
})