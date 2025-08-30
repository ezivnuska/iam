// apps/web/src/features/auth/AuthProvider.tsx

import React, { useEffect, useState, createContext } from 'react'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
	clearToken,
	logoutRequest,
	setAuthHeader,
	clearAuthHeader,
	trySigninFromStoredToken,
} from '@iam/services'
import { navigate } from '@shared/navigation'
import { Column, Row } from '@shared/grid'
import { Button } from '@shared/buttons'
import { paddingVertical, withAlpha } from '@iam/theme'
import type { AuthResponseType, User } from '@iam/types'
import { useSocket, useTheme } from '@shared/hooks'
import { AuthLayer } from '@features/auth'
import { AuthForm } from '.'
import type { AuthMode } from '@shared/forms'
import Ionicons from '@expo/vector-icons/Ionicons'
import { DefaultModal } from '@shared/modals/DefaultModal'

export type AuthContextType = {
    disconnecting: boolean,
	isAuthenticated: boolean
	isAuthInitialized: boolean
    loading: boolean
    secure?: boolean
	user: User | null
    authenticate: (response: AuthResponseType) => void
    hideAuthModal: () => void,
	logout: () => Promise<void>
	setUser: (user: User | null) => void
    showAuthModal: (isSecure: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({
    disconnecting: false,
	isAuthenticated: false,
	isAuthInitialized: false,
    loading: false,
    secure: false,
	user: null,
    hideAuthModal: () => {},
    showAuthModal: (isSecure: boolean) => {},
	logout: async () => {},
	setUser: () => {},
	authenticate: () => {},
})

type AuthProviderProps = {
	children: React.ReactNode
}

export const AuthProvider = ({
	children,
}: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isAuthInitialized, setIsAuthInitialized] = useState(false)
	const [disconnecting, setDisconnecting] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [secure, setSecure] = useState(false)
    const [authMode, setAuthMode] = useState<AuthMode>('signin')

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
    
    const { connectSocket, disconnectSocket } = useSocket()

    const loading = !isAuthInitialized

	useEffect(() => {
		const initialize = async () => {
			try {
				const authResponse = await trySigninFromStoredToken()
				if (authResponse) {
					await authenticate(authResponse)
				} else {
					navigate('Feed')
				}
			} catch (err) {
				console.log('Error initializing')
			} finally {
				setIsAuthInitialized(true)
			}
		}

		initialize()
	}, [])

	const authenticate = async (data: AuthResponseType) => {
		const { accessToken, user: userProfile } = data
		setAuthHeader(accessToken)
		setUser(userProfile)
		setIsAuthenticated(true)
		connectSocket(accessToken)
	}

	const logout = async () => {
        setDisconnecting(true)
		await logoutRequest()
		await clearToken()
		disconnectSocket()
		clearAuthHeader()
		setUser(null)
		setIsAuthenticated(false)
        setDisconnecting(false)
		navigate('Feed')
	}
    
    const renderModal = () => {
        return (
            <DefaultModal
                title={authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                onDismiss={() => setModalVisible(false)}
            >
                <AuthForm mode={authMode} dismiss={hideAuthModal} />
            </DefaultModal>
        )
    }

	return (
		<AuthContext.Provider
			value={{
                disconnecting,
				isAuthenticated,
				isAuthInitialized,
				user,
                loading,
				authenticate,
				logout,
                hideAuthModal,
				setUser,
                showAuthModal,
			}}
		>

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

            <AuthLayer>
                {children}
            </AuthLayer>

		</AuthContext.Provider>
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
		flex: 1,
		width: '90%',
		maxWidth: 400,
		minWidth: 300,
        alignSelf: 'center',
	},
    header: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
	},
    scrollContent: {
		flexGrow: 1,
        paddingTop: 6,
        paddingBottom: 24,
	},
})
