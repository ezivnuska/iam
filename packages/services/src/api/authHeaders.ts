// packages/services/src/api/authHeaders.ts

import { api } from '.'

export const setAuthHeader = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const clearAuthHeader = () => {
  delete api.defaults.headers.common['Authorization']
}
