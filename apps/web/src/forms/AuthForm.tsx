// apps/web/src/components/forms/AuthForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller, FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column, Row, SubmitButton, Button } from '@/components'
import { form as styles, shadows } from '@/styles'

type Mode = 'signin' | 'signup'

const signinSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
})

type SigninData = z.infer<typeof signinSchema>
type SignupData = z.infer<typeof signupSchema>

type Props = {
	mode: Mode
	onSubmitSignin: (data: SigninData) => Promise<any>
	onSubmitSignup: (data: SignupData) => Promise<any>
	switchMode: () => void
}

export const AuthForm = ({ mode, onSubmitSignin, onSubmitSignup, switchMode }: Props) => {
	const schema = mode === 'signin' ? signinSchema : signupSchema
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		getValues,
		setValue,
	} = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues:
			mode === 'signin'
				? { email: '', password: '' }
				: { email: '', username: '', password: '', confirmPassword: '' },
	})

	const refs = {
		email: useRef<RNTextInput>(null),
		username: useRef<RNTextInput>(null),
		password: useRef<RNTextInput>(null),
		confirmPassword: useRef<RNTextInput>(null),
	}

	const [focused, setFocused] = useState<string | null>(null)
	const isFocused = (name: string) => focused === name

	const focusField = (field: keyof typeof refs) => refs[field]?.current?.focus()

	const focusFirstError = (formErrors: FieldErrors) => {
		for (const field of Object.keys(formErrors)) {
			focusField(field as keyof typeof refs)
			break
		}
	}

	const onSubmit = async (data: any) => {
		const handler = mode === 'signin' ? onSubmitSignin : onSubmitSignup
		const response = await handler(data)
		if (response?.error) {
			console.log('response.error', response.error)
			for (const [field, issue] of response.error) {
				setError(field, { message: issue })
				// if (typeof field === 'string' && typeof issue === 'string') {
				// 	Alert.alert(`${mode === 'signin' ? 'Login' : 'Signup'} failed`, issue)
				// }
			}
		}
	}

	const onInvalid = (errors: FieldErrors) => focusFirstError(errors)

	return (
		<Column spacing={4}>
			<Controller
				control={control}
				name="email"
				render={({ field }) => (
					<TextInput
						{...field}
						ref={refs.email}
						placeholder="Email"
						placeholderTextColor="#070"
						autoCapitalize="none"
						keyboardType="email-address"
						style={[styles.input, shadows.input, isFocused('email') && styles.inputFocused]}
						onFocus={() => setFocused('email')}
						onBlur={() => setFocused(null)}
						returnKeyType="next"
						onSubmitEditing={() => mode === 'signup' ? focusField('username') : focusField('password')}
					/>
				)}
			/>
			<Text style={styles.error}>{errors.email?.message || ' '}</Text>

			{mode === 'signup' && (
				<>
					<Controller
						control={control}
						name="username"
						render={({ field }) => (
							<TextInput
								{...field}
								ref={refs.username}
								placeholder="Username"
								placeholderTextColor="#070"
								autoCapitalize="none"
								style={[styles.input, shadows.input, isFocused('username') && styles.inputFocused]}
								onFocus={() => setFocused('username')}
								onBlur={() => setFocused(null)}
								returnKeyType="next"
								onSubmitEditing={() => focusField('password')}
							/>
						)}
					/>
					<Text style={styles.error}>{errors.username?.message || ' '}</Text>
				</>
			)}

			<Controller
				control={control}
				name="password"
				render={({ field }) => (
					<TextInput
						{...field}
						ref={refs.password}
						placeholder="Password"
						placeholderTextColor="#070"
						secureTextEntry
						autoCapitalize="none"
						style={[styles.input, shadows.input, isFocused('password') && styles.inputFocused]}
						onFocus={() => setFocused('password')}
						onBlur={() => setFocused(null)}
						returnKeyType={mode === 'signup' ? 'next' : 'done'}
						onSubmitEditing={() => (mode === 'signup' ? focusField('confirmPassword') : handleSubmit(onSubmit, onInvalid)())}
					/>
				)}
			/>
			<Text style={styles.error}>{errors.password?.message || ' '}</Text>

			{mode === 'signup' && (
				<>
					<Controller
						control={control}
						name="confirmPassword"
						render={({ field }) => (
							<TextInput
								{...field}
								ref={refs.confirmPassword}
								placeholder="Confirm Password"
								placeholderTextColor="#070"
								secureTextEntry
								autoCapitalize="none"
								style={[styles.input, shadows.input, isFocused('confirmPassword') && styles.inputFocused]}
								onFocus={() => setFocused('confirmPassword')}
								onBlur={() => setFocused(null)}
								returnKeyType="done"
								onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
							/>
						)}
					/>
					<Text style={styles.error}>{errors.confirmPassword?.message || ' '}</Text>
				</>
			)}

			<Row spacing={10} justify="space-evenly">
				<SubmitButton
					label={mode === 'signin' ? 'Sign In' : 'Sign Up'}
					onPress={handleSubmit(onSubmit, onInvalid)}
					submitting={isSubmitting}
				/>
				<Button
					label={mode === 'signin' ? 'Sign Up' : 'Sign In'}
					onPress={switchMode}
					transparent
				/>
			</Row>
		</Column>
	)
}
