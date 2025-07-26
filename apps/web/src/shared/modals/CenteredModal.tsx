// apps/web/src/shared/modals/CenteredModal.tsx

import React, {
	createContext,
	ReactNode,
	useState,
} from 'react'
import {
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native'
import { useModal, useTheme } from '@shared/hooks'
import { withAlpha } from '@iam/theme'

export type CenteredModalProps = {
	children: ReactNode
    onDismiss?: () => {}
}

export const CenteredModal = ({ children, onDismiss }: CenteredModalProps) => {
    
    const { hideAllModals } = useModal()
	const { theme } = useTheme()

    const handleDismiss = () =>  {
        try {
            onDismiss?.()
        } finally {
            hideAllModals()
        }
    }

    return (
		<View
            style={[
                styles.overlay,
                { backgroundColor: withAlpha(theme.colors.muted, 0.8) },
            ]}
        >
            <Pressable
                onPress={handleDismiss}
                style={{ ...StyleSheet.absoluteFillObject }}
            />
            <View
                style={[
                    styles.modalContent,
                    { backgroundColor: theme.colors.background }
                ]}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
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
    scrollView: {
        flexGrow: 0,
    },
	container: {
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
	},
	modalContent: {
		maxHeight: '95%',
		borderRadius: 16,
		overflow: 'hidden',
		zIndex: 10000,
	},
	scrollViewContent: {
		padding: 16,
	},
	fullscreenModalContent: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        width: '100%',
		zIndex: 10000,
	},
})
