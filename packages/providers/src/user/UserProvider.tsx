// packages/providers/src/user/UserProvider.tsx

import React, { useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import { saveUserEmail, getUserEmail, clearUserEmail } from '../storage'

type UserProviderProps = { children: React.ReactNode }

export const UserProvider = ({ children }: UserProviderProps) => {
	const [email, setEmailState] = useState<string | null>(null)
	const [loaded, setLoaded] = useState<boolean>(false)

	useEffect(() => {
		async function loadEmail() {
			const savedEmail = await getUserEmail()
			setEmailState(savedEmail)
            setLoaded(true)
		}
		loadEmail()
	}, [])

	const setEmail = async (newEmail: string | null) => {
		if (newEmail) {
			await saveUserEmail(newEmail)
		} else {
			await clearUserEmail()
		}
		setEmailState(newEmail)
	}

	const logout = async () => {
		await clearUserEmail()
		setEmailState(null)
	}

	return (
		<UserContext.Provider value={{ email, setEmail, logout }}>
			{loaded && children}
		</UserContext.Provider>
	)
}