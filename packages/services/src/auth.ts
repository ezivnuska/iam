import { save, load, remove } from './storage'
import { navigate } from './navigation'

const TOKEN_KEY = 'access_token'

export async function login(token: string) {
	await save(TOKEN_KEY, token)
	navigate('Home') // or any protected screen
}

export async function logout() {
	await remove(TOKEN_KEY)
	navigate('Login')
}

export async function getToken(): Promise<string | null> {
	return load(TOKEN_KEY)
}