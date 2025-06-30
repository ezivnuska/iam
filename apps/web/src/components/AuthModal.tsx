// apps/web/src/components/AuthModal.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput as RNTextInput, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Column, Row, FormField, SubmitButton, Button } from '@/components'
import { useAuth, useModal } from '@/hooks'
// import { form as styles, shadows } from '@/styles'
import type { FieldValues, Control, Path } from 'react-hook-form'

type Mode = 'signin' | 'signup'

// Schemas
const signinSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z
	.object({
		email: z.string().email(),
		username: z.string().min(3, 'Username must be at least 3 characters'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

type SigninFormProps = z.infer<typeof signinSchema>
type SignupFormProps = z.infer<typeof signupSchema>

export const AuthModal = ({ initialMode = 'signin' }: { initialMode?: Mode }) => {
	const [mode, setMode] = useState<Mode>(initialMode)
	const { user, login } = useAuth()
	const { hideModal } = useModal()

	const [focused, setFocused] = useState<string | null>(null)
	const isFocused = (name: string): boolean => name === focused

	const signinForm = useForm<SigninFormProps>({
		resolver: zodResolver(signinSchema),
		mode: 'all',
		defaultValues: {
			email: user?.email ?? '',
			password: '',
		},
	})	

	const signupForm = useForm<SignupFormProps>({
		resolver: zodResolver(signupSchema),
		mode: 'all',
		defaultValues: {
			email: user?.email ?? '',
			username: '',
			password: '',
			confirmPassword: '',
		},
	})

	const signin = async (
		data: SigninFormProps
	): Promise<{ error?: { message: string; details: [string, string] }; message?: string }> => {
		try {
			await login(data.email, data.password)
			await AsyncStorage.setItem('user_email', data.email)
			hideModal()
			return {}
		} catch (err: unknown) {
			const errorObj = err as {
				response?: {
					data?: {
						error?: {
							details?: [string, string]
							message?: string
						}
					}
				}
			}
		
			const error = errorObj.response?.data?.error

			return {
				error: {
					message: error?.message ?? 'Unknown error',
					details: error?.details ?? ['email', 'Something went wrong'],
				},
			}
		}
	}

	useEffect(() => {
		AsyncStorage.getItem('user_email').then((storedEmail) => {
			if (storedEmail) {
				signinForm.setValue('email', storedEmail)
				signupForm.setValue('email', storedEmail)
			}
		})
	}, [])

	const onSubmitSignin = async (data: SigninFormProps) => {
		const response = await signin(data)
		console.log('response--->', response)
	  
		if (!response) {
			console.log('Error: could not log in.')
			return
		}
	  
		const { error } = response
	  
		if (error && Array.isArray(error.details)) {
			const [field, issue] = error.details
			if (typeof field === 'string' && typeof issue === 'string') {
				signinForm.setError(field as keyof SigninFormProps, { message: issue }, { shouldFocus: true })
				Alert.alert('Login failed', error.message)
				return
			}
		}
	  
		await AsyncStorage.setItem('user_email', data.email)
		await login(data.email, data.password)
		hideModal()
	}

	const onSubmitSignup = async (data: SignupFormProps) => {
		const res = await fetch('/api/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		})
		if (!res.ok) {
			const err = await res.json()
			const [field, msg] = err.message.split(':')
			if (field in data) {
				signupForm.setError(field as keyof SignupFormProps, { message: msg })
			}
			throw new Error(msg)
		}
		await login(data.email, data.password)
		await AsyncStorage.setItem('user_email', data.email)
		hideModal()
	}

	const handleSubmitForm = mode === 'signin'
		? signinForm.handleSubmit(onSubmitSignin)
		: signupForm.handleSubmit(onSubmitSignup)

	const signinFields: {
		name: keyof SigninFormProps
		label: string
		secure?: boolean
		autoFocus?: boolean
	}[] = [
		{ name: 'email', label: 'Email Address', autoFocus: true },
		{ name: 'password', label: 'Password', secure: true },
	]

	const signupFields: {
		name: keyof SignupFormProps
		label: string
		secure?: boolean
		autoFocus?: boolean
	}[] = [
		{ name: 'email', label: 'Email Address', autoFocus: true },
		{ name: 'username', label: 'Username' },
		{ name: 'password', label: 'Password', secure: true },
		{ name: 'confirmPassword', label: 'Confirm Password', secure: true },
	]

	function renderFields<T extends FieldValues>(
		fields: {
			name: keyof T
			label: string
			secure?: boolean
			autoFocus?: boolean
		}[],
		control: Control<T>,
		errors: Partial<Record<keyof T, any>>
	) {
		return (
			<>
				{fields.map(({ name, label, secure, autoFocus }) => (
					<FormField<T>
						key={name as string}
						name={name as Path<T>}
						label={label}
						control={control}
						error={errors[name]}
						secure={secure}
						autoFocus={autoFocus}
					/>
				))}
			</>
		)
	}	

	return (
		<Column spacing={6} style={{ padding: 20 }}>
			<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
				{mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
			</Text>

			{mode === 'signin'
				? renderFields<SigninFormProps>(signinFields, signinForm.control, signinForm.formState.errors)
				: renderFields<SignupFormProps>(signupFields, signupForm.control, signupForm.formState.errors)
			}

			<Row spacing={10} justify='space-evenly'>
				<SubmitButton
					label={mode === 'signin' ? 'Sign In' : 'Sign Up'}
					onPress={handleSubmitForm}
					submitting={
						mode === 'signin' ? signinForm.formState.isSubmitting : signupForm.formState.isSubmitting
					}					  
				/>
				<Button
					label={mode === 'signin' ? 'Need an account?' : 'Already have one?'}
					onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
					transparent
				/>
			</Row>
		</Column>
	)
}
