import axios from 'axios'
import { getToken } from './auth'

export const api = axios.create({
    baseURL: 'https://your.api.com',
})

api.interceptors.request.use(async config => {
    const token = await getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})