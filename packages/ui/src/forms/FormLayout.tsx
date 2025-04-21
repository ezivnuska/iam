// packages/ui/src/components/layouts/PageLayout/SectionLayout.tsx

import React, { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
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
		paddingHorizontal: 10,
		alignSelf: 'center',
    },
})