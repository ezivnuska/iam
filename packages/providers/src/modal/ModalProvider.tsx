// packages/providers/src/modal/ModalProvider.tsx

import React, {
	createContext,
	useState,
	useContext,
	useCallback,
	ReactNode,
} from 'react'
import { View, Platform, Pressable, StyleSheet } from 'react-native'

type ModalContent = ReactNode | null

interface ModalContextType {
	showModal: (content: ModalContent) => void
	hideModal: () => void
	content: ModalContent
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [content, setContent] = useState<ModalContent>(null)

	const showModal = useCallback((modalContent: ModalContent) => {
		setContent(modalContent)
	}, [])

	const hideModal = useCallback(() => {
		setContent(null)
	}, [])

	return (
		<ModalContext.Provider value={{ showModal, hideModal, content }}>
			{children}
			{content && (
				<View style={styles.modalOverlay}>
					<Pressable style={styles.backdrop} onPress={hideModal} />
					<View style={styles.modalContent}>
						{content}
					</View>
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
			? { position: 'fixed' as 'absolute' } // hack to suppress TS error
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
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalContent: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 24,
		minWidth: 300,
		maxWidth: '80%',
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 5,
	},
})
