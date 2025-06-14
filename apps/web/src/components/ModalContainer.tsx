// apps/web/src/components/ModalContainer.tsx

import React, { ReactNode } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Column, ModalHeader } from '@/components'

interface ModalContainerProps {
	children: ReactNode
	style?: ViewStyle
	title?: string
	contentStyle?: ViewStyle
	fullscreen?: boolean
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
	children,
	style,
	title,
	contentStyle,
	fullscreen = false,
}) => (
	<View style={[styles.container, style]}>
		<Column style={fullscreen ? styles.fullscreenContent : styles.content}>
			<ModalHeader title={title} />
			<View style={styles.main}>
				{children}
			</View>
		</Column>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		backgroundColor: '#fff',
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
