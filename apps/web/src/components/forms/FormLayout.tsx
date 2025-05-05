// apps/web/src/components/forms/FormLayout.tsx

import React, { ReactNode } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Column from '../Layout/Column'

const minWidth = 300
const maxWidth = 500

interface FormLayoutProps {
	children: ReactNode
	style?: ViewStyle
	contentStyle?: ViewStyle
}

export const FormLayout: React.FC<FormLayoutProps> = ({
    children,
    style,
    contentStyle,
}) => {
	return (
        <View style={[styles.container, style]}>
            <Column
                flex={1}
                spacing={10}
                style={[styles.form, styles.shadow, contentStyle]}
            >
                {children}
            </Column>
        </View>
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
		maxWidth,
        minWidth,
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