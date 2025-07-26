// apps/web/src/shared/forms/components/FormHeader.tsx

import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native'
import { Row } from '@shared/grid'
import { useTheme } from '@shared/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'

export interface FormHeaderProps {
	title: string
	subtitle?: string
	style?: StyleProp<ViewStyle>
    onCancel: () => void
}

export const FormHeader: React.FC<FormHeaderProps> = ({
	title,
	subtitle,
	style,
    onCancel,
}) => {
    const { theme } = useTheme()
    return (
        <Row align='center'>
            <View style={[styles.container, style]}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                {subtitle && <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
            </View>
            <Pressable onPress={onCancel}>
                <Ionicons name='close-sharp' size={28} color='black' />
            </Pressable>
        </Row>
    )
}

const styles = StyleSheet.create({
	container: {
        flex: 1,
		marginVertical: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
	},
	subtitle: {
		marginTop: 4,
		fontSize: 16,
	},
})