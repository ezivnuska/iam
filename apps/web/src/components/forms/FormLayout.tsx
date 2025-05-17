// apps/web/src/components/forms/FormLayout.tsx

import React, { ReactNode } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Column from '../Layout/Column'
import { FlexBox } from '../Layout'

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
            <FlexBox>
                <View style={styles.form}>
                    {children}
                </View>
            </FlexBox>
        </View>
	)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    form: {
        flex: 1,
        width: '100%',
        padding: 24,
        paddingBottom: 32,
		maxWidth,
        minWidth,
        alignSelf: 'center',
    },
})