// packages/screens/src/screens/ResetPasswordScreen.tsx

import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import type { RootStackParamList } from '@iam/types'
import { StackNavigationProp } from '@react-navigation/stack'
import { resetPassword } from '@iam/services'

type ResetPasswordParams = {
	token: string
}

type ResetPasswordScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'ResetPassword'
>

export const ResetPasswordScreen = () => {
	const route = useRoute()
	const navigation = useNavigation<ResetPasswordScreenNavigationProp>()
	const { token } = route.params as ResetPasswordParams

	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		if (newPassword !== confirmPassword) {
			Alert.alert('Passwords do not match')
			return
		}

		if (newPassword.length < 6) {
			Alert.alert('Password must be at least 6 characters')
			return
		}

		setLoading(true)

		try {
			const res = await resetPassword(token, newPassword)

			const data = await res.json()

			if (!res.ok) throw new Error(data.message || 'Something went wrong')

			Alert.alert('Success', 'Your password has been reset', [
				{
					text: 'OK',
					// onPress: () => navigation.navigate('Signin'),
				},
			])
		} catch (err: any) {
			Alert.alert('Error', err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Reset Password</Text>

			<TextInput
				secureTextEntry
				placeholder='New Password'
				value={newPassword}
				onChangeText={setNewPassword}
				style={styles.input}
			/>

			<TextInput
				secureTextEntry
				placeholder='Confirm Password'
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				style={styles.input}
			/>

			<Button title={loading ? 'Resetting...' : 'Reset Password'} onPress={handleSubmit} disabled={loading} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 24,
	},
	title: {
		fontSize: 24,
		marginBottom: 24,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 12,
		borderRadius: 8,
		marginBottom: 12,
	},
})