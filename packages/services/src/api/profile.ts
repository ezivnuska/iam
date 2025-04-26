// packages/services/src/api/profile.ts

import { api } from './http'

export const getProfile = () => api.get('/profile').then(res => res.data)
