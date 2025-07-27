// apps/web/src/shared/images/ImageGalleryHeader.tsx

import React from 'react'
import { IconButton } from '@shared/buttons'
import { Row } from '@shared/grid'
import { PageHeader } from '@shared/ui'
import { useImage, useModal } from '@shared/hooks'
import type { UploadedImage } from '@iam/types'
import { ImageUpload } from './ImageUpload'

export const ImageGalleryHeader = ({ ...props }) => {

    const { addImage } = useImage()
    const { hideModal, openFormModal } = useModal()

    const handleUploadSuccess = (newImage: UploadedImage) => {
        addImage(newImage)
        hideModal()
    }

    const openImageUploadModal = () => openFormModal(ImageUpload, { autoUpload: true, onUploaded: handleUploadSuccess }, {})

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
