// packages/services/src/constants/index.ts

console.log('process.env.API_PATH', process.env.API_PATH)
export const apiBaseUrl =
	process.env.API_PATH || 'http://localhost:4000/api' || 'https://iameric.me/api'

export const TOKEN_KEY = 'access_token'