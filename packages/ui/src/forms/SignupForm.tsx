// packages/ui/src/forms/SignupForm.tsx

import React, { useRef } from 'react'
import { Text, TextInput, StyleSheet, ActivityIndicator, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormLayout } from './FormLayout'
import { Button } from '../components'
import { useAuth } from '@providers'
import { signupRequest } from '@services'

const schema = z.object({
	email: z.string().email(),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
})

type SignupFormProps = z.infer<typeof schema>

export const SignupForm = () => {
	const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormProps>({
		resolver: zodResolver(schema),
	})
	const { login } = useAuth()

	const usernameInputRef = useRef<RNTextInput>(null)
	const passwordInputRef = useRef<RNTextInput>(null)
	const confirmPasswordInputRef = useRef<RNTextInput>(null)

	const onSubmit = async (data: SignupFormProps) => {
		try {
            await signupRequest(data.email, data.username, data.password)
			await login(data.email, data.password)
		} catch (err: any) {
			console.error('Signup error:', err)
			Alert.alert('Registration error', err?.response?.data?.message || 'Something went wrong')
		}
	}

	return (
		<FormLayout>
			<Text style={styles.title}>Create Account</Text>

			<Controller
				control={control}
				name="email"
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						placeholder="Email"
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						autoCapitalize="none"
						keyboardType="email-address"
						returnKeyType="next"
						onSubmitEditing={() => usernameInputRef.current?.focus()}
						style={styles.input}
					/>
				)}
			/>
			{errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

			<Controller
				control={control}
				name="username"
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={usernameInputRef}
						placeholder="Username"
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						autoCapitalize="none"
						returnKeyType="next"
						onSubmitEditing={() => passwordInputRef.current?.focus()}
						style={styles.input}
					/>
				)}
			/>
			{errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

			<Controller
				control={control}
				name="password"
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={passwordInputRef}
						placeholder="Password"
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						secureTextEntry
						autoCapitalize="none"
						returnKeyType="next"
						onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
						style={styles.input}
					/>
				)}
			/>
			{errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

			<Controller
				control={control}
				name="confirmPassword"
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={confirmPasswordInputRef}
						placeholder="Confirm Password"
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						secureTextEntry
						autoCapitalize="none"
						returnKeyType="done"
						onSubmitEditing={handleSubmit(onSubmit)}
						style={styles.input}
					/>
				)}
			/>
			{errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

			{isSubmitting ? (
				<ActivityIndicator style={{ marginTop: 20 }} />
			) : (
				<Button label="Sign Up" onPress={handleSubmit(onSubmit)} />
			)}
		</FormLayout>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 24,
	},
	input: {
		borderWidth: 1,
		borderColor: '#aaa',
		padding: 12,
		marginBottom: 12,
		borderRadius: 8,
	},
	error: {
		color: 'red',
		marginBottom: 8,
	},
})