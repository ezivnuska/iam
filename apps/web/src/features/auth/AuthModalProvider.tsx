// apps/web/src/app/features/auth/AuthModalProvider.tsx

import React, { createContext, ReactNode, useState, } from 'react'
import { Modal, Platform, StyleSheet, View } from 'react-native'
import { useTheme } from '@shared/hooks'
import { paddingVertical, withAlpha } from '@iam/theme'
import { AuthForm } from './AuthForm'
import { navigate } from '@shared/navigation'

export type AuthModalContextType = {
    secure?: boolean
	showAuthModal: (isSecure: boolean) => void
	hideAuthModal: () => void
}  

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [secure, setSecure] = useState(false)

	const { theme } = useTheme()

	const useNativeModal = Platform.OS !== 'web'

    const showAuthModal = (isSecure = false) => {
        setModalVisible(true)
        if (isSecure) setSecure(true)
    }

	const hideAuthModal = () => {
		setModalVisible(false)
        if (secure) navigate('Feed')
	}    

    const renderModal = () => (
        <View
            pointerEvents='box-none'
            style={[styles.overlay, { backgroundColor: withAlpha(theme.colors.background, 0.5) }]}
        >
            <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
                <AuthForm />
            </View>
        </View>
    )    

	return (
		<AuthModalContext.Provider value={{ hideAuthModal, showAuthModal }}>
			{modalVisible ? (
				useNativeModal ? (
					<Modal
						transparent
						visible={true}
						animationType='fade'
						presentationStyle='overFullScreen'
						onRequestClose={hideAuthModal}
					>
						{renderModal()}
					</Modal>
				) : (
					renderModal()
				)
			) : null}
			<View style={{ flex: 1 }}>{children}</View>
		</AuthModalContext.Provider>
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
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        width: '100%',
		zIndex: 10000,
        paddingVertical,
	},
})
