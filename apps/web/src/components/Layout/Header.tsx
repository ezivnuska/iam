// packages/ui/src/components/layouts/PageLayout/Header.tsx

import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { MAX_WIDTH } from './constants'
import { IconButton, Row, SigninForm } from '@/components'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import { resolveResponsiveProp } from '@/styles'
import { useAuth, useModal } from '@/hooks'

interface HeaderProps {
    children?: ReactNode
}

const Brand = ({...props}) => (
    <Pressable onPress={props.onPress}>
        <Row>
            <Text style={styles.iam}>iam</Text>
            <Text style={styles.eric}>eric</Text>
        </Row>
    </Pressable>
)

export const Header: React.FC<HeaderProps> = (props) => {
    const navigation = useNavigation()
    const iconSize = resolveResponsiveProp({ sm: 24, md: 18, lg: 18 })
    const showLabel = resolveResponsiveProp({ sm: false, md: true, lg: true })
    const currentRoute = useNavigationState((state) => state.routes[state.index].name)
    const { logout, isAuthenticated } = useAuth()
    const { showModal } = useModal()
    const showSigninModal = () => showModal(<SigninForm />)
	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Row
                    flex={1}
                    spacing={25}
                    align='center'
                    justify='space-between'
                    paddingHorizontal={16}
                    style={{ zIndex: 100 }}
                >
                    <Brand onPress={() => navigation.navigate('Home' as never)} />

                    {isAuthenticated && (
                        <Row
                            flex={5}
                            spacing={30}
                            align='center'
                            justify='center'
                        >
                            <IconButton
                                label='Feed'
                                onPress={() => navigation.navigate('Feed' as never)}
                                icon={<Ionicons name='chatbubbles-outline' size={iconSize} color='white' />}
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
                        // : currentRoute === 'Signin'
                        //     ? (
                        //         <IconButton
                        //             icon={<AntDesign name='login' size={iconSize} color='white' />}
                        //             label='Sign Up'
                        //             onPress={gotoSignUp}
                        //             showLabel={showLabel}
                        //         />
                        //     )
                        //     : (
                                // <IconButton
                                //     icon={<AntDesign name='login' size={iconSize} color='white' />}
                                //     label='Sign In'
                                //     onPress={gotoSignIn}
                                //     showLabel={showLabel}
                                // />
                        //     )
                    }
                </Row>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    maxWidthContainer: {
        width: '100%',
        maxWidth: MAX_WIDTH,
        alignSelf: 'center',
        marginHorizontal: 'auto',
    },
    brand: {
		fontSize: 20,
		fontWeight: 'bold',
        color: '#fff',
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
	navItems: {
		flexDirection: 'row',
		gap: 16,
	},
})