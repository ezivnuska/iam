// apps/web/src/components/ui/Heading.tsx

import React from 'react'
import { View, Text, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { paddingHorizontal, Size } from '@/styles'

export interface HeadingProps {
	title: string
	subtitle?: string
	style?: StyleProp<ViewStyle>
	titleStyle?: StyleProp<TextStyle>
	subtitleStyle?: StyleProp<TextStyle>
}

export const Heading: React.FC<HeadingProps> = ({
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
		color: '#eee',
	},
	subtitle: {
		marginTop: 4,
		fontSize: 14,
		color: '#ddd',
	},
})
