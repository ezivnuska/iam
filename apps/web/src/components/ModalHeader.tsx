// apps/web/src/components/forms/FormHeader.tsx

import React from 'react'
import { View, Text, StyleSheet, StyleProp, TextStyle, ViewStyle, Pressable } from 'react-native'
import { Row } from '@/components'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useModal } from '@/hooks'

export interface ModalHeaderProps {
	title?: string
	subtitle?: string
	style?: StyleProp<ViewStyle>
	titleStyle?: StyleProp<TextStyle>
	subtitleStyle?: StyleProp<TextStyle>
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
	title,
	subtitle,
	style,
	titleStyle,
	subtitleStyle,
}) => {
    const { hideModal } = useModal()
    return (
        <Row align='center'>
            {title && (
                <View style={[styles.container, style]}>
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
                    {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
                </View>
            )}
            <Pressable onPress={hideModal}>
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
		color: '#eee',
	},
	subtitle: {
		marginTop: 4,
		fontSize: 16,
		color: '#ddd',
	},
})