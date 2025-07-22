// apps/web/src/components/profile/ProfileViewHeader.tsx

import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { useAuth, useImage, useModal } from '@/hooks'
import { navigate } from '@/navigation'
import { Button, IconButton, ImageUploadForm, ScreenHeaderContainer, UserButton } from '@/components'
import { UploadedImage, User } from '@iam/types'

export const ProfileViewHeader: React.FC<any> = () => {

    const { user, logout } = useAuth()
    const { addImage } = useImage()
    const { hideModal, openFormModal } = useModal()

    const handleUploadSuccess = (newImage: UploadedImage) => {
        addImage(newImage)
        hideModal()
    }

    const openImageUploadModal = () => openFormModal(ImageUploadForm, { onUploaded: handleUploadSuccess }, {})

    const route = useNavigationState((state) => {
        const profileRoute = state.routes.find((r) => r.name === 'Profile')
        if (profileRoute && 'state' in profileRoute && profileRoute.state) {
            const nestedState = profileRoute.state
            return nestedState.routes[nestedState.index || 0]?.name || null
        }
        return null
    })
    
    const gotoImages = () => navigate('Images' as never)

	return (
        <ScreenHeaderContainer>
            <UserButton user={user as User} />
            <Button
                label='Images'
                onPress={gotoImages}
                variant={route === 'Images' ? 'transparent' : 'muted'}
                disabled={route === 'Images'}
            />
            <IconButton
                onPress={openImageUploadModal}
                iconName='add-circle-outline'
                iconSize={40}
            />
            
            <Button
                label='Sign Out'
                onPress={logout}
                variant='muted'
            />
        </ScreenHeaderContainer>
	)
}
