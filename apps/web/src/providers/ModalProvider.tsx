// apps/web/src/providers/ModalProvider.tsx

import React, {
	createContext,
	useState,
	useContext,
	useCallback,
	ReactNode,
} from 'react'
import { View, Platform, Pressable, StyleSheet } from 'react-native'

type ModalContent = ReactNode | null

export type ModalContextType = {
	showModal: (content: ModalContent) => void
	hideModal: () => void
	hideAllModals: () => void
	modalStack: ModalContent[]
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
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

	return (
		<ModalContext.Provider
			value={{ showModal, hideModal, hideAllModals, modalStack }}
		>
			{children}
			{topModal && (
				<View style={styles.modalOverlay}>
					<Pressable style={styles.backdrop} onPress={hideModal} />
					{typeof topModal === 'string' ? (
						<View style={styles.modalContent}>{topModal}</View>
					) : (
						topModal
					)}
				</View>
			)}
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
	modalOverlay: {
		...(Platform.OS === 'web'
			? { position: 'fixed' as 'absolute' }
			: { position: 'absolute' }),
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
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 24,
		minWidth: 300,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 5,
	},
})
