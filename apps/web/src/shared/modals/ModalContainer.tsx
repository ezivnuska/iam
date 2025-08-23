// apps/web/src/shared/modals/ModalContainer.tsx

import React, { ReactNode } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { Column, Row } from '@shared/grid'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useModal, useTheme } from '@shared/hooks'
import { paddingVertical, Size } from '@iam/theme'

interface ModalContainerProps {
	children: ReactNode
	title?: string
	subtitle?: string
	onDismiss?: () => void
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
	children,
	title,
	subtitle,
    onDismiss,
}) => {
	const { hideAllModals } = useModal()
	const { theme } = useTheme()

    const handleClose = () => {
        try {
            onDismiss?.()
        } finally {
			hideAllModals()
		}
    }

	return (
        <Column flex={1} style={styles.content} spacing={Size.M}>
            <Row align='center'>
                {!!title && (
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                        {subtitle && <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
                    </View>
                )}
                <Pressable onPress={handleClose}>
                    <Ionicons name='close-sharp' size={28} color={theme.colors.text} />
                </Pressable>
            </Row>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    style={{ flex: 1, alignContent: 'stretch' }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            {/* <Column flex={1} style={styles.main}>{children}</Column> */}
        </Column>
	)
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
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
		width: '90%',
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
        paddingBottom: Size.S,
	},
})
