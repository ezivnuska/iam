// apps/web/src/providers/ModalProvider.tsx

import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'
import {
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	View,
} from 'react-native'
import { createPortal } from 'react-dom'
import { MAX_WIDTH } from '@/components'
import { ModalContainer } from '@/components'

// --- Types ---
export type ModalContentObject = {
	content: ReactNode
	fullscreen?: boolean
}

export type ModalContent = ModalContentObject | null

export type ModalContextType = {
	showModal: (content: ModalContent) => void
	hideModal: () => void
	hideAllModals: () => void
	modalStack: ModalContent[]
	openFormModal: (
		Component: React.FC<any>,
		props: Record<string, any>,
		options: { title?: string; fullscreen?: boolean }
	) => void
}  

// --- Context ---
export const ModalContext = createContext<ModalContextType | undefined>(
	undefined
)

// --- Provider ---
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

	// --- Modal Stack Controls ---
	const showModal = useCallback((modalContent: ModalContent) => {
		if (modalContent === null) return

		const contentObj: ModalContentObject =
			typeof modalContent === 'object' &&
			modalContent !== null &&
			'content' in modalContent
				? modalContent
				: { content: modalContent }

		setModalStack((prev) => [...prev, contentObj])
	}, [])

	const hideModal = useCallback(() => {
		setModalStack((prev) => prev.slice(0, -1))
	}, [])

	const hideAllModals = useCallback(() => {
		setModalStack([])
	}, [])

	// --- Factory Method for Standard Form Modals ---
	const openFormModal = useCallback(
		(
			Component: React.FC<any>,
			props: Record<string, any> = {},
			options: { title?: string; fullscreen?: boolean } = {}
		) => {
			const wrappedContent = (
				<ModalContainer title={options.title || ''}>
					<Component {...props} />
				</ModalContainer>
			)

			showModal({
				content: wrappedContent,
				fullscreen: options.fullscreen ?? false,
			})
		},
		[showModal]
	)

	return (
		<ModalContext.Provider
			value={{
				showModal,
				hideModal,
				hideAllModals,
				openFormModal,
				modalStack,
			}}
		>
			<View style={{ flex: 1 }}>{children}</View>

			{modalContent &&
				(useNativeModal ? (
					<Modal
						transparent
						visible
						animationType='fade'
						presentationStyle='overFullScreen'
						onRequestClose={hideModal}
					>
						<Overlay fullscreen={fullscreen} onClose={hideModal}>
							{modalContent}
						</Overlay>
					</Modal>
				) : (
					typeof document !== 'undefined' &&
					createPortal(
						<Overlay fullscreen={fullscreen} onClose={hideModal}>
							{modalContent}
						</Overlay>,
						document.body
					)
				))}
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
