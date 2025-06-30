// packages/services/src/api/profile.ts

import { api } from './http'

export const getProfile = () => api.get('/profile').then(res => {
    console.log('profile response', res.data)
    return res.data
})
export const updateSelf = (data: any) => api.put(`/profile`, data).then(res => res.data)
export const setAvatar = async (imageId: string | null | undefined) => {
    if (imageId === undefined) {
        // If the imageId is undefined, unset the avatar by making a DELETE request
        return api.delete('/profile/avatar')
            .then(res => res.data)
            .catch(err => {
                console.error('Error unsetting avatar:', err)
                throw err
            })
    } else {
        // If imageId is provided, set the avatar with the given imageId
        return api.patch(`/profile/avatar/${imageId}`)
            .then(res => res.data)
            .catch(err => {
                console.error('Error setting avatar:', err)
                throw err
            })
    }
}