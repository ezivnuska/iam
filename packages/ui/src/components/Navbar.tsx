// components/Navbar.tsx

import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { Button, Row, Stack } from '.'
import { useAuth } from '@providers'

type NavItem = {
	label: string
	routeName: string
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

	return (
		<Row
            flex={1}
            spacing={10}
            align='center'
            justify='space-between'
            paddingHorizontal={16}
            // paddingVertical={4}
            style={{ zIndex: 100 }}
        >
            <Brand onPress={() => navigate('Home')} />

			{isAuthenticated && (
                <Row
                    flex={5}
                    spacing={10}
                    align='center'
                    justify='flex-end'
                >
                    {navItems.map((item, index) => {
                        const isActive = item.routeName === currentRoute
                        return (
                            <Pressable
                                key={index}
                                style={[styles.button, isActive && styles.activeButton]}
                                onPress={() => navigate(item.routeName)}
                                disabled={isActive}
                            >
                                <Text style={[styles.buttonLabel, isActive && styles.activeButtonLabel]}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        )
                    })}
                </Row>
            )}

            {isAuthenticated && (
                <Pressable onPress={logout}>
                    <Text style={styles.buttonLabel}>Sign Out</Text>
                </Pressable>
            )}
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
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        // backgroundColor: '#f0f0f0',
    },
    activeButton: {
        // backgroundColor: '#007bff', // Blue when active
    },
    buttonLabel: {
        fontSize: 16,
        color: '#ddd',
    },
    activeButtonLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
})