// apps/web/src/shared/modals/ModalContainer.tsx

import React, { ReactNode } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { Column, Row } from '@shared/grid'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useModal, useTheme } from '@shared/hooks'
import { withAlpha } from '@iam/theme'

interface DefaultModalProps {
	children: ReactNode
	title?: string
	onDismiss?: () => void
}

export const DefaultModal: React.FC<DefaultModalProps> = ({
	children,
	title,
    onDismiss,
}) => {
	const { theme } = useTheme()

	return (
        <View
            style={[styles.overlay, { backgroundColor: withAlpha(theme.colors.background, 1) }]}
        >
            <Column flex={1} style={styles.content}>
                <Row align='center' paddingVertical={12}>
                    <Row spacing={24} align='center' style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                    </Row>
                    <Pressable onPress={onDismiss}>
                        <Ionicons name='close-sharp' size={28} color={theme.colors.text} />
                    </Pressable>
                </Row>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    style={{ flex: 1 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </Column>
        </View>
	)
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'box-none',
    },
    content: {
		flex: 1,
		width: '90%',
		maxWidth: 400,
		minWidth: 300,
        alignSelf: 'center',
	},
    header: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
	},
    scrollContent: {
		flexGrow: 1,
        paddingTop: 6,
        paddingBottom: 24,
	},
})
