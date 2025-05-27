// apps/packages/services/src/api/bonds.ts

import { api } from './'
import { Bond } from '@iam/types'

export const getUserBonds = async (userId: string): Promise<Bond[]> =>
    api.get(`/bond/user/${userId}`).then(res => res.data)

export const updateBondStatus = async (
    bondId: string,
    statusUpdate: Partial<{ confirmed: boolean; declined: boolean; cancelled: boolean }>,
    userId: string
): Promise<Bond> =>
    await api.put(`/bond/${bondId}`, { ...statusUpdate, userId }, { withCredentials: true }).then((res) => res.data)

export const createBond = async (responder: string): Promise<Bond> =>
    await api.post('/bond', { responder }, { withCredentials: true }).then(res => res.data)      

export const deleteBond = async (bondId: string): Promise<void> =>
	await api.delete(`/bond/${bondId}`, { withCredentials: true }).then(res => res.data)
