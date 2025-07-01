// apps/web/src/forms/hooks/useAuthForm.ts

import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth, useModal } from '@/hooks'
import type { Path, UseFormSetError, FieldValues } from 'react-hook-form'
import type { AuthMode } from '@/forms'

export function useAuthForm<T extends FieldValues>() {
	const { login, signup } = useAuth()
	const { hideModal } = useModal()

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

			hideModal()
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
