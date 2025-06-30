// packages/services/src/api/users.ts

import { api } from './http'

export const getUsers = () => api.get('/users').then(res => res.data)
export const getUserById = (id: string) => api.get(`/users/${id}`).then(res => res.data)
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data).then(res => res.data)
export const deleteUser = (id: string) => api.delete(`/users/${id}`).then(res => res.data)
export const getUserByUsername = async (username: string) => {
    try {
		const res = await api.get(`/users/user/${username}`)
        const normalized = { ...res.data, id: res.data._id }
		return normalized
	} catch (err: any) {
		if (err?.response?.status === 404) {
			console.warn('User not found')
			return null
		}
		throw err
	}
}
