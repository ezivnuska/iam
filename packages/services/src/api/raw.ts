// packages/services/src/api/raw.ts

import axios from 'axios'
import { apiBaseUrl } from '../constants'

export const rawApi = axios.create({
	baseURL: apiBaseUrl,
	withCredentials: true,
	transformRequest: [(data, headers) => {
		delete headers['Authorization']
		return JSON.stringify(data)
	}],
})
