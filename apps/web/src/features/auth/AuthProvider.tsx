// apps/web/src/features/auth/AuthProvider.tsx

import React, { createContext, useEffect, useState, useMemo } from 'react'
import { Modal, Platform } from 'react-native'
import {
	logoutRequest,
	trySigninFromStoredToken,
	tokenStorage,
	setAuthHeader,
	clearAuthHeader,
} from '@iam/services'
import { useSocket, useTheme } from '@shared/hooks'
import { AuthLayer } from '@features/auth'
import { AuthForm } from '.'
import { AuthMode } from '@shared/forms'
import { DefaultModal } from '@shared/modals/DefaultModal'
import type { AuthResponseType, User } from '@iam/types'

export type AuthContextType = {
	disconnecting: boolean
	isAuthenticated: boolean
	isAuthInitialized: boolean
	loading: boolean
	secure?: boolean
	user?: User
	authenticate: (response: AuthResponseType) => Promise<void>
	hideAuthModal: () => void
	logout: () => Promise<void>
	setUser: (user: User | undefined) => void
	showAuthModal: (isSecure: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({
	disconnecting: false,
	isAuthenticated: false,
	isAuthInitialized: false,
	loading: false,
	secure: false,
	user: undefined,
	authenticate: async () => {},
	hideAuthModal: () => {},
	logout: async () => {},
	setUser: () => {},
	showAuthModal: () => {},
})

type AuthState = {
	user?: User
	isAuthInitialized: boolean
	disconnecting: boolean
	modalVisible: boolean
	secure: boolean
	authMode: AuthMode
}

type AuthProviderProps = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const { theme } = useTheme()
	const [state, setState] = useState<AuthState>({
		user: undefined,
		isAuthInitialized: false,
		disconnecting: false,
		modalVisible: false,
		secure: false,
		authMode: AuthMode.SIGNIN,
	})

	const useNativeModal = Platform.OS !== 'web'
	const { connectSocket, disconnectSocket } = useSocket()

	const isAuthenticated = useMemo(() => !!state.user, [state.user])
	const loading = useMemo(() => !state.isAuthInitialized, [state.isAuthInitialized])

	// ---------------- Modal ----------------
	const showAuthModal = (secure = false) => {
		if (!state.modalVisible) setState(prev => ({ ...prev, modalVisible: true, secure }))
	}
	const hideAuthModal = () => setState(prev => ({ ...prev, modalVisible: false, secure: false }))

	// ---------------- Set User ----------------
	const setUser = (user: User | undefined) => setState(prev => ({ ...prev, user }))
	useEffect(() => {
		if (state.user && state.modalVisible) hideAuthModal()
	}, [state.user])

	// ---------------- Initialize Auth ----------------
	useEffect(() => {
		const initialize = async () => {
			try {
				const authResponse = await trySigninFromStoredToken()
				if (authResponse) await authenticate(authResponse)
			} catch (err) {
				console.log('[AuthProvider] Error initializing auth:', err)
			} finally {
				setState(prev => ({ ...prev, isAuthInitialized: true }))
			}
		}
		initialize()
	}, [])

	// ---------------- Authenticate ----------------
	const authenticate = async (data: AuthResponseType) => {
		const { user, accessToken, refreshToken } = data

		if (Platform.OS !== 'web' && accessToken && refreshToken) {
			// Native - store tokens and set header
			await tokenStorage.save(accessToken, refreshToken)
			setAuthHeader(accessToken)
		}

		// Web - cookies handle auth automatically
		const tokenForSocket = Platform.OS === 'web' ? undefined : accessToken
		connectSocket(tokenForSocket)

		setUser(user)
	}

	// ---------------- Logout ----------------
	const logout = async () => {
		setState(prev => ({ ...prev, disconnecting: true }))
		await logoutRequest()

		if (Platform.OS !== 'web') await tokenStorage.clear()
		clearAuthHeader()
		disconnectSocket()
		setState(prev => ({ ...prev, user: undefined, disconnecting: false }))
	}

	// ---------------- Modal Render ----------------
	const renderModal = () => (
		<DefaultModal
			title={state.authMode === AuthMode.SIGNIN ? 'Sign In' : 'Sign Up'}
			onDismiss={hideAuthModal}
		>
			<AuthForm mode={state.authMode} dismiss={hideAuthModal} />
		</DefaultModal>
	)

	return (
		<AuthContext.Provider
			value={{
				disconnecting: state.disconnecting,
				isAuthenticated,
				isAuthInitialized: state.isAuthInitialized,
				loading,
				user: state.user,
				authenticate,
				logout,
				hideAuthModal,
				setUser,
				showAuthModal,
			}}
		>
			{state.modalVisible &&
				(useNativeModal ? (
					<Modal
						transparent
						visible
						animationType="fade"
						presentationStyle="overFullScreen"
						onRequestClose={hideAuthModal}
					>
						{renderModal()}
					</Modal>
				) : (
					renderModal()
				))
			}

			<AuthLayer>{children}</AuthLayer>
		</AuthContext.Provider>
	)
}
