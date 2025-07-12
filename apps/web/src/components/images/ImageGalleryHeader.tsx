// apps/web/src/components/images/ImageManagerHeader.tsx

import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { IconButton, ImageUploadForm, Row } from '@/components'
import { useImage, useModal, useTheme } from '@/hooks'
import type { UploadedImage } from '@iam/types'

export const ImageGalleryHeader = () => {

    const { addImage } = useImage()
    const { hideModal, openFormModal } = useModal()
    const { theme } = useTheme()

    const handleUploadSuccess = (newImage: UploadedImage) => {
        addImage(newImage)
        hideModal()
    }

    const openImageUploadModal = () => openFormModal(ImageUploadForm, { onUploaded: handleUploadSuccess }, {})

	return (
		<Row spacing={10}>
			<Text style={[styles.title, { color: theme.colors.text }]}>Images</Text>
            <IconButton
                onPress={openImageUploadModal}
                iconName='add-circle-outline'
                iconSize={30}
            />
		</Row>
	)
}

const styles = StyleSheet.create({
	title: {
        flex: 1,
		fontSize: 24,
		fontWeight: 600,
	},
})