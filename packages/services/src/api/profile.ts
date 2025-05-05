// packages/services/src/api/profile.ts

import { api } from './http'

export const getProfile = () => api.get('/profile').then(res => res.data)
export const updateSelf = (data: any) => api.put(`/profile`, data).then(res => res.data)