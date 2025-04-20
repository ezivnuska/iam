// packages/ui/src/components/PageHeader/PageHeader.tsx

import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native'
import type { PageHeaderProps } from './PageHeader.types'

const PageHeader: React.FC<PageHeaderProps> = ({
	title,
	subtitle,
	style,
	titleStyle,
	subtitleStyle,
}) => {
	return (
		<View style={[styles.container, style]}>
		<Text style={[styles.title, titleStyle]}>{title}</Text>
		{subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
		</View>
	)
}

export default PageHeader

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
		color: '#111',
	},
	subtitle: {
		marginTop: 4,
		fontSize: 16,
		color: '#666',
	},
})