// packages/services/src/constants/index.ts

export const apiBaseUrl =
	process.env.API_PATH || 'http://localhost:4000/api' || 'https://iameric.me/api'

export const TOKEN_KEY = 'accessToken'