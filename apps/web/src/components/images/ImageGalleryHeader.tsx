// apps/web/src/components/images/ImageGalleryHeader.tsx

import React from 'react'
import { IconButton, ImageUploadForm, PageHeader, Row } from '@/components'
import { useImage, useModal, useTheme } from '@/hooks'
import type { UploadedImage } from '@iam/types'

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
			<PageHeader title='Images' />
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
