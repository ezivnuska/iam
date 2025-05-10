// packages/services/src/constants/index.ts

export const apiBaseUrl = process.env.API_PATH ?? 'https://iameric.me/api'
console.log('apiBaseUrl', apiBaseUrl)
export const TOKEN_KEY = 'accessToken'