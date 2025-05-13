// apps/web/src/components/Navbar.tsx

import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { IconButton, Row } from '@/components'
import { useAuth } from '../hooks'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import { resolveResponsiveProp } from '../styles'

type AllowedIonicons =
	| 'chatbubbles-outline'
	| 'people-outline'
	| 'person-circle-outline'

type NavItem = {
	label: string
	routeName: string
    iconName?: AllowedIonicons
}

type NavbarProps = {
	navItems: NavItem[]
    navigate: (routeName: string) => void
}

const Brand = ({...props}) => (
    <Pressable onPress={props.onPress}>
        <Row>
            <Text style={styles.iam}>iam</Text>
            <Text style={styles.eric}>eric</Text>
        </Row>
    </Pressable>
)

export const Navbar = ({ navItems, navigate }: NavbarProps) => {
    
    const currentRoute = useNavigationState((state) => {
        const route = state.routes[state.index]
        return route.name;
    })

    const { logout, isAuthenticated } = useAuth()

    const gotoSignIn = () => navigate('Signin')
    const gotoSignUp = () => navigate('Signup')

    const iconSize = resolveResponsiveProp({ sm: 24, md: 18, lg: 18 })
    const showLabel = resolveResponsiveProp({ sm: false, md: true, lg: true })

	return (
		<Row
            flex={1}
            spacing={25}
            align='center'
            justify='space-between'
            paddingHorizontal={16}
            style={{ zIndex: 100 }}
        >
            <Brand onPress={() => navigate('Home')} />

			{isAuthenticated && (
                <Row
                    flex={5}
                    spacing={30}
                    align='center'
                    justify='center'
                >
                    {navItems.map((item, index) => {
                        const isActive = item.routeName === currentRoute
                        return (
                            <View key={index}>
                                <IconButton
                                    label={item.label}
                                    onPress={() => navigate(item.routeName)}
                                    icon={item.iconName && <Ionicons name={item.iconName} size={iconSize} color='white' />}
                                    active={isActive}
                                    showLabel={showLabel}
                                />
                            </View>
                        )
                    })}
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
                : currentRoute === 'Signin'
                    ? (
                        <IconButton
                            icon={<AntDesign name='login' size={iconSize} color='white' />}
                            label='Sign Up'
                            onPress={gotoSignUp}
                            showLabel={showLabel}
                        />
                    )
                    : (
                        <IconButton
                            icon={<AntDesign name='login' size={iconSize} color='white' />}
                            label='Sign In'
                            onPress={gotoSignIn}
                            showLabel={showLabel}
                        />
                    )
            }
		</Row>
	)
}

const styles = StyleSheet.create({
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