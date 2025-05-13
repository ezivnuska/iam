// apps/web/src/components/ImageManagerHeader.tsx

import React, { useState } from 'react'
import { Text, StyleSheet } from 'react-native'
import { Button, ImageUpload, Row } from '.'
import type { ImageItem } from '@iam/types'
import { useModal } from '@/hooks'

export const ImageManagerHeader = () => {
    const { hideModal, showModal } = useModal()

	const [images, setImages] = useState<ImageItem[]>([])

	const handleUploadSuccess = (newImage: ImageItem) => {
		setImages(prev => [newImage, ...prev])
        hideModal()
	}

    const openImageUploadModal = () => {
        showModal(<ImageUpload onUploadSuccess={handleUploadSuccess} />)
    }

	return (
		<Row spacing={10}>
			<Text style={styles.title}>Images</Text>
            <Button label='Add Image' onPress={openImageUploadModal} />
		</Row>
	)
}

const styles = StyleSheet.create({
	title: {
        flex: 1,
		fontSize: 24,
		fontWeight: '600',
		color: '#111',
	},
})