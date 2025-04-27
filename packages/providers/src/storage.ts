// packages/ui/src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage'

const EMAIL_KEY = 'user_email'

export async function saveUserEmail(email: string) {
	try {
		await AsyncStorage.setItem(EMAIL_KEY, email)
	} catch (error) {
		console.error('Failed to save email:', error)
	}
}

export async function getUserEmail(): Promise<string | null> {
	try {
		const email = await AsyncStorage.getItem(EMAIL_KEY)
		return email
	} catch (error) {
		console.error('Failed to load email:', error)
		return null
	}
}

export async function clearUserEmail() {
	try {
		await AsyncStorage.removeItem(EMAIL_KEY)
	} catch (error) {
		console.error('Failed to clear email:', error)
	}
}