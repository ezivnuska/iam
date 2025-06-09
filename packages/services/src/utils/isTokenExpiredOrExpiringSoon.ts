// packages/services/src/utils/isTokenExpiredOrExpiringSoon.ts

import { jwtDecode } from 'jwt-decode'

export const isTokenExpiredOrExpiringSoon = (token: string, thresholdSeconds = 300): boolean => {
	try {
		const { exp } = jwtDecode<{ exp: number }>(token)
		const now = Math.floor(Date.now() / 1000)
		return exp < now || exp - now < thresholdSeconds
	} catch {
		return true
	}
}
