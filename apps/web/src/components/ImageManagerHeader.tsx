// apps/web/src/components/ImageManagerHeader.tsx

import React from 'react'
import { Text, StyleSheet, Pressable } from 'react-native'
import { ImageUpload, Row } from '.'
import { useModal } from '@/hooks'
import Ionicons from '@expo/vector-icons/Ionicons'

export const ImageManagerHeader = () => {
    const { showModal } = useModal()

    const openImageUploadModal = () => showModal(<ImageUpload />)

	return (
		<Row spacing={10}>
			<Text style={styles.title}>Images</Text>
            <Pressable onPress={openImageUploadModal}>
                <Ionicons name='add-circle-outline' size={30} color='black' />
            </Pressable>
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