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
import { createPortal } from 'react-dom'
  
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
	const useNativeModal = Platform.OS !== 'web'
  
	return (
	  <ModalContext.Provider value={{ showModal, hideModal, hideAllModals, modalStack }}>
		<View style={{ flex: 1 }}>
			{children}
		</View>
  
		{topModal &&
		  (useNativeModal ? (
			<Modal
			  transparent
			  visible
			  animationType='fade'
			  presentationStyle='overFullScreen'
			  onRequestClose={hideModal}
			>
			  <Overlay onClose={hideModal}>{topModal}</Overlay>
			</Modal>
		  ) : (
			typeof document !== 'undefined' &&
			createPortal(
			  <Overlay onClose={hideModal}>{topModal}</Overlay>,
			  document.body
			)
		  ))}
	  </ModalContext.Provider>
	)
}

const Overlay = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => {
	return (
	  <View pointerEvents="box-none" style={styles.overlay}>
		<Pressable style={styles.backdrop} onPress={onClose} />
		<View style={styles.modalContent}>{children}</View>
	  </View>
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
	  backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
	  width: '90%',
	  maxWidth: 600,
	  minHeight: 200,
	  backgroundColor: '#fff',
	  borderRadius: 8,
	  padding: 16,
	  elevation: 10,
	  zIndex: 10000,
	},
})
  