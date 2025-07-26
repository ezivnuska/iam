// apps/web/src/shared/images/ImageGalleryHeader.tsx

import React from 'react'
import { IconButton } from '@shared/buttons'
import { Row } from '@shared/grid'
import { ImageUploadForm } from '@shared/forms'
import { PageHeader } from '@shared/ui'
import { useImage, useModal, useTheme } from '@shared/hooks'
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
