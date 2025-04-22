// packages/ui/src/components/layouts/PageLayout/SectionLayout.tsx

import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { MAX_FORM_WIDTH as maxWidth } from './constants'

export interface FormLayoutProps {
    children: ReactNode
}

export const FormLayout: React.FC<FormLayoutProps> = ({
    children,
}) => {
	return (
        <View style={styles.container}>
            {children}
        </View>
	)
}

const styles = StyleSheet.create({
    container: {
		width: '100%',
		maxWidth: maxWidth,
        minWidth: 300,
		alignSelf: 'center',
    },
})