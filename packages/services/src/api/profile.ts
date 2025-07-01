// packages/services/src/api/profile.ts

import { api } from './http'

export const getProfile = () => api.get('/profile').then(res => {
    return res.data
})
export const updateSelf = (data: any) => api.put(`/profile`, data).then(res => res.data)
export const setAvatar = async (imageId: string | null | undefined) => {
    if (imageId === undefined) {
        return api.delete('/profile/avatar')
            .then(res => res.data)
            .catch(err => {
                console.error('Error unsetting avatar:', err)
                throw err
            })
    } else {
        return api.patch(`/profile/avatar/${imageId}`)
            .then(res => res.data)
            .catch(err => {
                console.error('Error setting avatar:', err)
                throw err
            })
    }
}