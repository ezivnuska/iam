// apps/web/src/components/forms/FormHeader.tsx

import React from 'react'
import { View, Text, StyleSheet, StyleProp, TextStyle, ViewStyle, Pressable } from 'react-native'
import { Row } from '../Layout'
import Ionicons from '@expo/vector-icons/Ionicons'

export interface FormHeaderProps {
	title: string
	subtitle?: string
	style?: StyleProp<ViewStyle>
	titleStyle?: StyleProp<TextStyle>
	subtitleStyle?: StyleProp<TextStyle>
    onCancel: () => void
}

export const FormHeader: React.FC<FormHeaderProps> = ({
	title,
	subtitle,
	style,
	titleStyle,
	subtitleStyle,
    onCancel,
}) => (
    <Row>
        <View style={[styles.container, style]}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
        </View>
        <Pressable onPress={onCancel}>
            <Ionicons name='close-sharp' size={28} color='black' />
        </Pressable>
    </Row>
)

const styles = StyleSheet.create({
	container: {
        flex: 1,
		marginVertical: 16,
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