// packages/ui/src/components/layouts/PageLayout/Header.tsx

import React, { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { MAX_WIDTH } from './constants'
import { Navbar } from '../../components'
import { useNavigation } from '@react-navigation/native'

interface HeaderProps {
    children?: ReactNode
}

export const Header: React.FC<HeaderProps> = (props) => {
    const navigation = useNavigation()
	return (
        <View style={styles.container}>
            <View style={styles.maxWidthContainer}>
                <Navbar
                    navItems={[
                        { label: 'Users', routeName: 'UserList' },
                        { label: 'Profile', routeName: 'Profile' },
                    ]}
                    navigate={(routeName) => navigation.navigate(routeName as never)}
                />
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
})