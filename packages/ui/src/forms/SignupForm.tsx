// packages/screens/src/screens/RegisterScreen.tsx

import React from 'react'
import { Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { FormLayout } from './FormLayout'
import { Button } from '../components'
import { useForm, Controller } from 'react-hook-form'
import { api, login } from '@services'

// Optional zod validation
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
	email: z.string().email(),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignupFormProps = z.infer<typeof schema>
// If not using zod, you could use:
// type RegisterForm = { email: string; username: string; password: string }

export const SignupForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormProps>({
		resolver: zodResolver(schema), // optional
	})

	const onSubmit = async (data: SignupFormProps) => {
		try {
		const res = await api.post('/auth/register', data)
		const token = res.data?.token
		if (token) {
			await login(token)
		} else {
			Alert.alert('Registration failed', 'No token received')
		}
		} catch (err: any) {
			console.error(err)
			Alert.alert('Registration error', err?.response?.data?.message || 'Something went wrong')
		}
	}

	return (
		<FormLayout>
			<Text style={styles.title}>Create Account</Text>

			<Controller
				control={control}
				name="email"
				render={({ field: { value, onChange } }) => (
				<TextInput
					placeholder="Email"
					value={value}
					onChangeText={onChange}
					autoCapitalize="none"
					keyboardType="email-address"
					style={styles.input}
				/>
				)}
			/>
			{errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

			<Controller
				control={control}
				name="username"
				render={({ field: { value, onChange } }) => (
				<TextInput
					placeholder="Username"
					value={value}
					onChangeText={onChange}
					autoCapitalize="none"
					style={styles.input}
				/>
				)}
			/>
			{errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

			<Controller
				control={control}
				name="password"
				render={({ field: { value, onChange } }) => (
                    <TextInput
                        placeholder="Password"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry
                        style={styles.input}
                    />
				)}
			/>
			{errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

			{isSubmitting ? (
				<ActivityIndicator style={{ marginTop: 20 }} />
			) : (
				<Button label="Sign Up" onPress={handleSubmit(onSubmit)} />
			)}
		</FormLayout>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
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