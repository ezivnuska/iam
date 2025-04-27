// packages/services/src/tokenStorage.ts

import localStorage from '@react-native-async-storage/async-storage'
import { refreshTokenRequest } from './api'
import { TOKEN_KEY } from './constants'

export async function saveToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token)
}

export async function getToken(): Promise<string | null> {
	return localStorage.getItem(TOKEN_KEY)
}

export async function clearToken() {
	localStorage.removeItem(TOKEN_KEY)
}

export async function refreshAccessToken(): Promise<string> {
    console.log(':::refreshAccessToken:::')
	const { accessToken } = await refreshTokenRequest()
	if (!accessToken) throw new Error('No access token received')
	return accessToken
}

export async function getUserFromToken(token: string): Promise<any> {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return { email: payload.email, username: payload.username } // Add other fields as needed
    } catch (error) {
        throw new Error('Failed to decode token')
    }
}

//
// with expo-secure-storage...

// import { Platform } from 'react-native'

// // Conditionally import to avoid crash on web
// let SecureStore: typeof import('expo-secure-store') | undefined
// if (Platform.OS !== 'web') {
//   SecureStore = require('expo-secure-store')
// }

// const STORAGE_KEY = 'accessToken'

// export const tokenStorage = {
//   async save(key: string, value: string) {
//     if (Platform.OS === 'web') {
//       localStorage.setItem(key, value)
//     } else {
//       await SecureStore?.setItemAsync?.(key, value)
//     }
//   },

//   async get(key: string): Promise<string | null> {
//     if (Platform.OS === 'web') {
//       return localStorage.getItem(key)
//     } else {
//       return await SecureStore?.getItemAsync?.(key) ?? null
//     }
//   },

//   async remove(key: string) {
//     if (Platform.OS === 'web') {
//       localStorage.removeItem(key)
//     } else {
//       await SecureStore?.deleteItemAsync?.(key)
//     }
//   },
// }
