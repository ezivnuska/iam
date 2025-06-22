// apps/web/src/providers/ModalProvider.tsx

import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native'
import { createPortal } from 'react-dom'
import { MAX_WIDTH } from '@/components'
  
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
}
  
export const ModalContext = createContext<ModalContextType | undefined>(undefined)

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

  
	const showModal = useCallback((modalContent: ReactNode | ModalContentObject | null) => {
		if (modalContent === null) return
	
		const contentObj: ModalContentObject =
			typeof modalContent === 'object' &&
			modalContent !== null &&
			'content' in modalContent
				? modalContent
				: { content: modalContent }
		
			setModalStack(prev => [...prev, contentObj])
		},
	[])	  
  
	const hideModal = useCallback(() => {
	  setModalStack(prev => prev.slice(0, -1))
	}, [])
  
	const hideAllModals = useCallback(() => {
	  setModalStack([])
	}, [])
  
	return (
	    <ModalContext.Provider value={{ showModal, hideModal, hideAllModals, modalStack }}>
			<View style={{ flex: 1 }}>
				{children}
			</View>
	
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
					typeof document !== 'undefined' && createPortal(
						<Overlay fullscreen={fullscreen} onClose={hideModal}>
							{modalContent}
						</Overlay>,
						document.body
					)
				))
            }
	    </ModalContext.Provider>
	)
}

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
  