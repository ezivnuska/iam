// apps/web/src/features/profile/components/ProfileViewHeader.tsx

import React from 'react'
import { useNavigationState } from '@react-navigation/native'
import { useAuth, useImage, useModal } from '@shared/hooks'
import { navigate } from '@shared/navigation'
import { Button, IconButton, UserButton } from '@shared/buttons'
import { ImageUpload } from '@shared/images'
import { Row } from '@shared/grid'
import { ScreenHeaderContainer } from '@shared/layout'
import { Size } from '@iam/theme'
import { UploadedImage, User } from '@iam/types'

export const ProfileViewHeader: React.FC<any> = () => {

    const { user, logout } = useAuth()
    const { addImage } = useImage()
    const { hideModal, openFormModal } = useModal()

    const handleUploadSuccess = (newImage: UploadedImage) => {
        addImage(newImage)
        hideModal()
    }

    const openImageUploadModal = () => openFormModal(ImageUpload, { autoUpload: true, onUploaded: handleUploadSuccess }, { title: 'Upload Image', fullscreen: true })

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
            <Row flex={1} spacing={Size.M} align='center'>
                <UserButton user={user as User} />
                <Button
                    label='Images'
                    onPress={gotoImages}
                    variant={route === 'Images' ? 'transparent' : 'muted'}
                    disabled={route === 'Images'}
                    compact
                />
                {route === 'Images' && (
                    <IconButton
                        onPress={openImageUploadModal}
                        iconName='add-circle-outline'
                        iconSize={28}
                    />
                )}
            </Row>
            
            <Button
                label='Sign Out'
                onPress={logout}
                variant='muted'
                compact
            />
        </ScreenHeaderContainer>
	)
}
