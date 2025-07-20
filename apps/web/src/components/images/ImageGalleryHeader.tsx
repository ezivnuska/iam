// apps/web/src/components/images/ImageManagerHeader.tsx

import React from 'react'
import { Text } from 'react-native'
import { IconButton, ImageUploadForm, Row } from '@/components'
import { useImage, useModal, useTheme } from '@/hooks'
import type { UploadedImage } from '@iam/types'
import { paddingVertical } from '@iam/theme'

export const ImageGalleryHeader = ({ ...props }) => {

    const { addImage } = useImage()
    const { hideModal, openFormModal } = useModal()
    const { theme } = useTheme()

    const handleUploadSuccess = (newImage: UploadedImage) => {
        addImage(newImage)
        hideModal()
    }

    const openImageUploadModal = () => openFormModal(ImageUploadForm, { onUploaded: handleUploadSuccess }, {})

	return (
		<Row
            spacing={10}
            align='center'
        >
			<Text style={{ fontSize: 24, fontWeight: '600', color: theme.colors.text }}>Images</Text>
            {props.owner && (
                <IconButton
                    onPress={openImageUploadModal}
                    iconName='add-circle-outline'
                    iconSize={30}
                />
            )}
		</Row>
	)
}
