// packages/services/src/api/users.ts

import { api } from './http'

export const getUsers = () => api.get('/users').then(res => res.data)
export const getUserById = (id: string) => api.get(`/users/${id}`).then(res => res.data)
export const getUserByUsername = (username: string) => api.get(`/users/user/${username}`).then(res => res.data)
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data).then(res => res.data)
export const deleteUser = (id: string) => api.delete(`/users/${id}`).then(res => res.data)
