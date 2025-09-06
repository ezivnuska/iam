// apps/web/src/hooks/useAuthForm.ts

import { Alert, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { signinRequest, signupRequest, tokenStorage } from '@iam/services'
import type { Path, UseFormSetError, FieldValues } from 'react-hook-form'
import { useAuth } from '@features/auth'
import type { AuthMode } from '@shared/forms'

export function useAuthForm<T extends FieldValues>() {
    const { authenticate, hideAuthModal } = useAuth()
	const login = async (email: string, password: string) => {
        const authResponse = await signinRequest(email, password)
        // Native - store tokens securely
        if (Platform.OS !== 'web') await tokenStorage.save(authResponse.accessToken)
        await authenticate(authResponse)
        hideAuthModal()
    }

	const signup = async (email: string, username: string, password: string) => {
        const authResponse = await signupRequest(email, username, password)
        if (Platform.OS !== 'web') await tokenStorage.save(authResponse.accessToken)
        await authenticate(authResponse)
        hideAuthModal()
    }

	const handleSubmit = async (
		data: T,
		setError: UseFormSetError<T>,
		opts: {
			mode?: AuthMode
			saveEmail?: boolean
		} = {}
	) => {
		try {
			if (opts.mode === 'signup') {
				await signup(data.email, data.username, data.password)
			} else {
				await login(data.email, data.password)
			}

			if (opts.saveEmail) {
				await AsyncStorage.setItem('user_email', data.email)
			}
		} catch (err: any) {
			const message =
				err?.response?.data?.error?.message ?? err?.message ?? 'Unknown error'
			const details =
				err?.response?.data?.error?.details ?? ['email', 'Something went wrong']
			const [field, issue] = details
			setError(field as Path<T>, { message: issue })
			Alert.alert(`${opts.mode === 'signup' ? 'Signup' : 'Login'} failed`, message)
		}
	}

	return { handleSubmit }
}
