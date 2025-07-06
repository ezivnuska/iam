// packages/services/src/auth/authState.ts

export let isLoggedOut = false

export const setLoggedOut = (value: boolean) => {
	isLoggedOut = value
}
