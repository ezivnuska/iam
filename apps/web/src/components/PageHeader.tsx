// apps/web/src/components/PageHeader.tsx

import React from 'react'
import { View, Text, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { paddingHorizontal, Size } from '@/styles'

export interface PageHeaderProps {
	title: string
	subtitle?: string
	style?: StyleProp<ViewStyle>
	titleStyle?: StyleProp<TextStyle>
	subtitleStyle?: StyleProp<TextStyle>
}

export const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	subtitle,
	style,
	titleStyle,
	subtitleStyle,
}) => (
    <View style={[styles.container, style]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
    </View>
)

const styles = StyleSheet.create({
	container: {
		marginVertical: 16,
        paddingHorizontal: paddingHorizontal,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#111',
	},
	subtitle: {
		marginTop: 4,
		fontSize: 14,
		color: '#666',
	},
})