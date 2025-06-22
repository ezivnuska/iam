// apps/web/src/components/ModalContainer.tsx

import React, { ReactNode } from 'react'
import { View, Text, StyleSheet, StyleProp, TextStyle, ViewStyle, Pressable } from 'react-native'
import { Column, Row } from '@/components'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useModal } from '@/hooks'
import { Size } from '@/styles'

interface ModalContainerProps {
	children: ReactNode
	style?: ViewStyle
	title?: string
	fullscreen?: boolean
}

interface ModalHeaderProps {
    title?: string
    subtitle?: string
    titleStyle?: StyleProp<TextStyle>
    subtitleStyle?: StyleProp<TextStyle>
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
	children,
	style,
	title,
	fullscreen = false,
}) => (
	<View style={[styles.container, style]}>
		<Column
            spacing={Size.M}
			style={fullscreen ? styles.fullscreenContent : styles.content}
		>
			<ModalHeader title={title} />
			<View style={styles.main}>
				{children}
			</View>
		</Column>
	</View>
)

const ModalHeader: React.FC<ModalHeaderProps> = ({
	title,
	subtitle,
	titleStyle,
	subtitleStyle,
}) => {
    const { hideModal } = useModal()
    return (
        <Row align='center'>
            {title && (
                <View style={styles.header}>
                    <Text style={[styles.title, titleStyle]}>{title}</Text>
                    {subtitle ? <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text> : null}
                </View>
            )}
            <Pressable onPress={hideModal}>
                <Ionicons name='close-sharp' size={28} color='#fff' />
            </Pressable>
        </Row>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		backgroundColor: 'transparent',
        paddingVertical: Size.M,
	},
	header: {
        flex: 1,
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
	fullscreen: {
		paddingHorizontal: 0,
	},
	content: {
		flex: 1,
		width: '100%',
		paddingHorizontal: 16,
		maxWidth: 400,
		minWidth: 300,
		alignSelf: 'center',
	},
	fullscreenContent: {
		flex: 1,
		maxWidth: '100%',
		minWidth: '100%',
		paddingHorizontal: 0,
	},
	main: {
		flex: 1,
	},
})
