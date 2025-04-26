import { api } from '.'
import { saveToken } from '../tokenStorage'

export const signinRequest = (email: string, password: string) =>
	api.post('/auth/signin', { email, password }).then(res => res.data)

export const signupRequest = (email: string, username: string, password: string) =>
	api.post('/auth/signup', { email, username, password }).then(res => res.data)

export const refreshTokenRequest = async () => {
	const response = await api.post('/auth/refresh-token')
    return response.data as { accessToken: string }
}
export const logoutRequest = () =>
	api.post('/auth/logout').then(res => res.data)

/**
 * Signin with a provided token
 * - Save the token locally
 * - Set it on axios
 * - Verify by fetching user profile
 */
export async function signinWithToken(token: string): Promise<void> {
	await saveToken(token)

	// Set token on axios immediately
    console.log('signinWithToken: Saved token:', token)
	api.defaults.headers.common.Authorization = `Bearer ${token}`

	// Make sure token is valid by hitting /profile
	await api.get('/profile')
}