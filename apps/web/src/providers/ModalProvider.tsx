// apps/web/src/providers/ModalProvider.tsx

import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import {
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	View,
} from 'react-native'
import { MAX_WIDTH } from '@/components'
import { ModalContainer } from '@/components'

export type ModalContentObject = {
	content: ReactNode
	fullscreen?: boolean
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

    useEffect(() => {
        console.log('ModalProvider mounted')
        console.log('modalStack', modalStack)
		return () => console.log('ModalProvider unmounted')
    }, [])

	const hideModal = () => {
		setModalStack((prev) => prev.slice(0, -1))
	}

	const hideAllModals = () => {
		setModalStack([])
	}

	// --- Factory Method for Standard Form Modals ---
	const openFormModal = (
        Component: React.FC<any>,
        props: Record<string, any> = {},
        options: { title?: string; fullscreen?: boolean } = {}
    ) => {
		console.log('openFormModal', options.title)
        const wrappedContent = (
            <ModalContainer title={options.title || ''}>
                <Component {...props} />
            </ModalContainer>
        )

        showModal(wrappedContent, options.fullscreen ?? false)
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
			<View style={{ flex: 1 }}>{children}</View>

			{modalContent ? (
				useNativeModal ? (
					<Modal
						transparent
						visible={true}
						animationType='fade'
						presentationStyle='overFullScreen'
						onRequestClose={hideModal}
					>
						<Overlay
							key={modalStack.length}
							fullscreen={fullscreen}
							onClose={hideModal}
						>
							{modalContent}
						</Overlay>
					</Modal>
				) : (
					<Overlay
						key={modalStack.length}
						fullscreen={fullscreen}
						onClose={hideModal}
					>
						{modalContent}
					</Overlay>
				)
			) : null}
		</ModalContext.Provider>
	)
}

// --- Overlay ---
const Overlay = ({
	children,
	fullscreen = false,
	onClose,
}: {
	children: ReactNode
	fullscreen?: boolean
	onClose: () => void
}) => {
	return (
		<View pointerEvents='box-none' style={styles.overlay}>
			<Pressable style={styles.backdrop} onPress={onClose} />
			<View style={fullscreen ? styles.fullscreenModalContent : styles.modalContent}>
				{children}
			</View>
		</View>
	)
}

// --- Context Hook ---
export const useModalContext = () => {
	const context = useContext(ModalContext)
	if (!context) {
		throw new Error('useModalContext must be used within a ModalProvider')
	}
	return context
}

// --- Styles ---
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
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.9)',
	},
	modalContent: {
		width: MAX_WIDTH,
		maxWidth: MAX_WIDTH,
		backgroundColor: '#000',
		borderRadius: 12,
		elevation: 10,
		zIndex: 10000,
	},
	fullscreenModalContent: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: '#000',
		padding: 16,
		zIndex: 10000,
	},
})
