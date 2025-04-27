// packages/ui/src/components/layouts/PageLayout/SectionLayout.tsx

import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { MAX_FORM_WIDTH as maxWidth } from './constants'
import { Stack } from '../components'

export interface FormLayoutProps {
    children: ReactNode
}

export const FormLayout: React.FC<FormLayoutProps> = ({
    children,
}) => {
	return (
        <View style={styles.container}>
            <Stack
                flex={1}
                spacing={10}
                style={[styles.form, styles.shadow]}
            >
                {children}
            </Stack>
        </View>
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
		maxWidth: maxWidth,
        minWidth: 300,
		alignSelf: 'center',
    },
    form: {
        flex: 1,
        width: '100%',
        padding: 24,
        paddingBottom: 32,
        borderRadius: 24,
        marginHorizontal: 'auto',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 2,
    },
})