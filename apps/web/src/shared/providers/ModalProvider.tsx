// apps/web/src/app/providers/ModalProvider.tsx

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
import { ModalContainer, CenteredModal } from '@shared/modals'
import { useModal, useTheme } from '@shared/hooks'
import { paddingVertical, withAlpha } from '@iam/theme'

export type ModalContentObject = {
	content: ReactNode
	fullscreen?: boolean
    onDismiss?: () => {}
}

export type ModalContent = ModalContentObject | null

export type ModalContextType = {
	showModal: (content: ReactNode, fullscreen?: boolean) => void
	hideModal: () => void
	hideAllModals: () => void
	openFormModal: (
		Component: React.FC<any>,
		props: Record<string, any>,
		options: { title?: string; fullscreen?: boolean }
	) => void
}  

export const ModalContext = createContext<ModalContextType | undefined>(
	undefined
)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [modalStack, setModalStack] = useState<ModalContent[]>([])

	const topModal = modalStack[modalStack.length - 1]
	const useNativeModal = Platform.OS !== 'web'

	const modalContent =
		topModal && typeof topModal === 'object' && 'content' in topModal
			? topModal.content
			: topModal

	const fullscreen =
		topModal && typeof topModal === 'object' && 'fullscreen' in topModal
			? topModal.fullscreen ?? false
			: false

    const showModal = (content: ReactNode, fullscreen: boolean = false) => {
        setModalStack((prev) => [
            ...prev,
            { content, fullscreen },
        ])
    }

	const hideModal = () => {
		setModalStack((prev) => prev.slice(0, -1))
	}

	const hideAllModals = () => {
		setModalStack([])
	}

	const openFormModal = (
        Component: React.FC<any>,
        props: Record<string, any> = {},
        options: { title?: string; fullscreen?: boolean } = {}
    ) => {
        const { title, fullscreen = false } = options
    
        const wrappedContent = (
            <ModalContainer title={title} {...props}>
                <Component {...props} />
            </ModalContainer>
        )
    
        setModalStack((prev) => [
            ...prev,
            {
                content: wrappedContent,
                fullscreen,
                onDismiss: props.onDismiss,
            },
        ])
    }    

    const renderOverlay = () => {
        const onDismiss =
            topModal && typeof topModal === 'object' && 'onDismiss' in topModal
                ? topModal.onDismiss
                : undefined
    
        return fullscreen ? (
            <FullscreenOverlay key={modalStack.length}>
                {modalContent}
            </FullscreenOverlay>
        ) : (
            <CenteredModal key={modalStack.length} onDismiss={onDismiss}>
                {modalContent}
            </CenteredModal>
        )
    }    

	return (
		<ModalContext.Provider
			value={{
				showModal,
				hideModal,
				hideAllModals,
				openFormModal,
			}}
		>
			{modalContent ? (
				useNativeModal ? (
					<Modal
						transparent
						visible={true}
						animationType='fade'
						presentationStyle='overFullScreen'
						onRequestClose={hideModal}
					>
						{renderOverlay()}
					</Modal>
				) : (
					renderOverlay()
				)
			) : null}
			<View style={{ flex: 1 }}>{children}</View>
		</ModalContext.Provider>
	)
}

const FullscreenOverlay = ({
	children,
}: {
	children: ReactNode,
}) => {
	const { theme } = useTheme()
	return (
		<View
            style={[styles.overlay, { backgroundColor: withAlpha(theme.colors.background, 0.5) }]}
        >
            <View
                style={[
                    styles.fullscreenModalContent,
                    { backgroundColor: theme.colors.background }
                ]}
            >
                {children}
            </View>
		</View>
	)
}

const Overlay = ({
	children,
}: {
	children: ReactNode
}) => {
	const { hideAllModals } = useModal()
	const { theme } = useTheme()
	return (
		<View
            style={[
                styles.overlay,
                { backgroundColor: withAlpha(theme.colors.muted, 0.8) },
            ]}
        >
            <Pressable
                onPress={hideAllModals}
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
        paddingVertical,
	},
})
