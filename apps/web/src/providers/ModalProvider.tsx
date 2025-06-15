// apps/web/src/providers/ModalProvider.tsx

import React, {
	createContext,
	useState,
	useContext,
	useCallback,
	ReactNode,
} from 'react'
import {
	Modal,
	View,
	Platform,
	Pressable,
	StyleSheet,
} from 'react-native'

type ModalContent = ReactNode | null

export type ModalContextType = {
	showModal: (content: ModalContent) => void
	hideModal: () => void
	hideAllModals: () => void
	modalStack: ModalContent[]
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
	const [modalStack, setModalStack] = useState<ModalContent[]>([])

	const showModal = useCallback((modalContent: ModalContent) => {
		setModalStack(prev => [...prev, modalContent])
	}, [])

	const hideModal = useCallback(() => {
		setModalStack(prev => prev.slice(0, -1))
	}, [])

	const hideAllModals = useCallback(() => {
		setModalStack([])
	}, [])

	const topModal = modalStack[modalStack.length - 1]

	const useNativeModal = Platform.OS !== 'web'

	const modalOverlayStyle = [
		styles.baseOverlay,
		Platform.OS === 'web' ? { position: 'fixed' as any } : { position: 'absolute' },
	]

	return (
		<ModalContext.Provider
			value={{ showModal, hideModal, hideAllModals, modalStack }}
		>
			{children}
			{topModal &&
				(useNativeModal ? (
					<Modal
						transparent
						visible
						animationType='fade'
						presentationStyle='overFullScreen'
						onRequestClose={hideModal}
					>
						<View style={modalOverlayStyle}>
							<Pressable style={styles.backdrop} onPress={hideModal} />
							<View style={styles.modalContent}>{topModal}</View>
						</View>
					</Modal>
				) : (
					<View style={modalOverlayStyle}>
						<Pressable style={styles.backdrop} onPress={hideModal} />
						<View style={styles.modalContent}>{topModal}</View>
					</View>
				))}
		</ModalContext.Provider>
	)
}

export const useModalContext = () => {
	const context = useContext(ModalContext)
	if (!context) {
		throw new Error('useModalContext must be used within a ModalProvider')
	}
	return context
}

const styles = StyleSheet.create({
	baseOverlay: {
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
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		height: '100%',
		backgroundColor: '#fff', // or make this transparent if needed
		zIndex: 10000,
	},
})
