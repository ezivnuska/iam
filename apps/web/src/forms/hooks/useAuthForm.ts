// apps/web/src/forms/hooks/useAuthForm.ts

import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Path, UseFormSetError, FieldValues } from 'react-hook-form'
import type { AuthMode } from '@/forms'
import { saveToken, signinRequest, signupRequest } from '@services'
import { AuthResponseType } from '@iam/types'

export function useAuthForm<T extends FieldValues>(
	authenticate: (data: AuthResponseType) => void
) {
	const login = async (email: string, password: string) => {
		const authenticatedUser = await signinRequest(email, password)
		await saveToken(authenticatedUser.accessToken)
		authenticate(authenticatedUser)
	}

	const signup = async (email: string, username: string, password: string) => {
		const authenticatedUser = await signupRequest(email, username, password)
		await saveToken(authenticatedUser.accessToken)
		authenticate(authenticatedUser)
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
