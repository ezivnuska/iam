// packages/services/src/auth/tokenStorage.ts

import { Platform } from 'react-native'

// Conditionally import SecureStore for native
let SecureStore: typeof import('expo-secure-store') | undefined
if (Platform.OS !== 'web') {
	SecureStore = require('expo-secure-store')
}

const TOKEN_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export const tokenStorage = {
	
	async save(accessToken: string, refreshToken?: string): Promise<void> {
		if (Platform.OS === 'web') return
		await SecureStore?.setItemAsync(TOKEN_KEY, accessToken)
		if (refreshToken) {
			await SecureStore?.setItemAsync(REFRESH_KEY, refreshToken)
		}
	},

	async getAccessToken(): Promise<string | null> {
		if (Platform.OS === 'web') return null
		return (await SecureStore?.getItemAsync(TOKEN_KEY)) ?? null
	},

	async getRefreshToken(): Promise<string | null> {
		if (Platform.OS === 'web') return null
		return (await SecureStore?.getItemAsync(REFRESH_KEY)) ?? null
	},

	async clear(): Promise<void> {
		if (Platform.OS === 'web') return
		await SecureStore?.deleteItemAsync(TOKEN_KEY)
		await SecureStore?.deleteItemAsync(REFRESH_KEY)
	},
}
