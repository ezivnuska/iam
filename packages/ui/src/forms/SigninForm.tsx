// packages/screens/src/forms/LoginForm.tsx

import React from 'react'
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { FormLayout } from './FormLayout'
import { Button } from '../components'
import { useForm, Controller } from 'react-hook-form'
import { api, login as loginUser } from '@services'

// Optional: validation with zod
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SigninFormProps = z.infer<typeof schema>
// Without zod:
// type SigninFormProps = { email: string; password: string }

export const SigninForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SigninFormProps>({
		resolver: zodResolver(schema), // remove if not using zod
	})

	const onSubmit = async (data: SigninFormProps) => {
		try {
            const res = await api.post('/auth/login', data)
            const token = res.data?.token
            if (token) {
                await loginUser(token)
            } else {
                Alert.alert('Login failed', 'No token received')
            }
		} catch (err: any) {
            console.error(err)
            Alert.alert('Login failed', err?.response?.data?.message || 'Something went wrong')
		}
	}

  	return (
		<FormLayout>
			<Text style={styles.title}>Log In</Text>

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
				<Button label='Log In' onPress={handleSubmit(onSubmit)} />
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