import React from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@services'

const schema = z.object({
	email: z.string().email('Please enter a valid email'),
})

type ForgotPasswordForm = z.infer<typeof schema>

export const ForgotPasswordScreen = () => {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordForm>({
		resolver: zodResolver(schema),
	})

	const onSubmit = async (data: ForgotPasswordForm) => {
		try {
			await api.post('/auth/forgot-password', { email: data.email })
			Alert.alert(
				'Email Sent',
				'Check your inbox for a link to reset your password.'
			)
		} catch (err: any) {
			console.error(err)
			Alert.alert('Error', err?.response?.data?.message || 'Something went wrong')
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Forgot Password?</Text>
			<Text style={styles.subtitle}>We'll send you a reset link.</Text>

			<Controller
				control={control}
				name='email'
				render={({ field: { value, onChange } }) => (
					<TextInput
						placeholder='Enter your email'
						value={value}
						onChangeText={onChange}
						keyboardType='email-address'
						autoCapitalize='none'
						style={styles.input}
					/>
				)}
			/>
			
			{errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

			<Button title='Send Reset Link' onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 24,
		color: '#666',
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