// apps/web/src/components/profile/ProfileViewHeader.tsx

import React from 'react'
import { View } from 'react-native'
import { useNavigationState } from '@react-navigation/native'
import { useImage, useModal, useTheme } from '@/hooks'
import { navigate } from '@/navigation'
import { Button, IconButton, ImageUploadForm } from '@/components'
import { UploadedImage } from '@iam/types'

export const ProfileViewHeader: React.FC<any> = () => {

    const { addImage } = useImage()
    const { hideModal, openFormModal } = useModal()
    const { theme } = useTheme()

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

    const renderContent = () => {
        switch (route) {
            case 'Main':
                return (
                    <Button
                        label='Images'
                        onPress={gotoImages}
                        variant='muted'
                    />
                )
            case 'Images':
                return (
                    <IconButton
                        onPress={openImageUploadModal}
                        iconName='add-circle-outline'
                        iconSize={40}
                    />
                )
            default: return null
        }
    }
	return (
        <View style={{ backgroundColor: theme.colors.background }}>
            {renderContent()}
        </View>
	)
}
