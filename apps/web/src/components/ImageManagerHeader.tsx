// apps/web/src/components/ImageManagerHeader.tsx

import React from 'react'
import { Text, StyleSheet, Pressable } from 'react-native'
import { ImageUploadForm, Row } from '@/components'
import { useImage, useModal } from '@/hooks'
import type { UploadedImage } from '@iam/types'
import Ionicons from '@expo/vector-icons/Ionicons'

export const ImageManagerHeader = () => {

    const { addImage } = useImage()
    const { hideModal, openFormModal } = useModal()

    const handleUploadSuccess = (newImage: UploadedImage) => {
        addImage(newImage)
        hideModal()
    }

    const openImageUploadModal = () => openFormModal(ImageUploadForm, { onUploaded: handleUploadSuccess }, {})

	return (
		<Row spacing={10}>
			<Text style={styles.title}>Images</Text>
            <Pressable onPress={openImageUploadModal}>
                <Ionicons name='add-circle-outline' size={30} color='#fff' />
            </Pressable>
		</Row>
	)
}

const styles = StyleSheet.create({
	title: {
        flex: 1,
		fontSize: 24,
		fontWeight: '600',
		color: '#eee',
	},
})