// apps/web/src/shared/modals/ImageUploadModal.tsx

import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { IconButton } from '@shared/buttons'
import { NativeCamera, WebCamera } from '@shared/media'
import { selectImage } from '@shared/images'
import { useResponsiveImageSize } from '@shared/hooks'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Platform } from 'react-native'

type ImageDataType = {
	uri: string
	filename: string
	width?: number
	height?: number
}

type ImageUploadModalProps = {
	onImageSelected: (imageData: ImageDataType) => void
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ onImageSelected }) => {
	const [uploadUri, setUploadUri] = useState<string | null>(null)
	const [useCamera, setUseCamera] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const { width, height } = useResponsiveImageSize()

	const handleCapture = async (uri: string) => {
		setUploadUri(uri)
		setUseCamera(false)

		onImageSelected({ uri, filename: `captured_${Date.now()}.jpg` })
	}

	const handlePick = async () => {
		try {
			const selected = await selectImage()
			if (!selected) return
			setUploadUri(selected.uri)
			onImageSelected(selected.imageData)
		} catch (err) {
			console.error(err)
			setError('Failed to pick image.')
		}
	}

	if (useCamera) {
		return Platform.OS === 'web' ? (
			<WebCamera onCapture={handleCapture} onCancel={() => setUseCamera(false)} />
		) : (
			<NativeCamera onCapture={handleCapture} onCancel={() => setUseCamera(false)} />
		)
	}

	return (
		<View style={styles.container}>
			{uploadUri && (
				<Image
					source={{ uri: uploadUri }}
					style={[styles.preview, { width: width * 0.9, height: height * 0.5 }]}
					resizeMode='contain'
				/>
			)}
			<View style={styles.controls}>
				<IconButton label='Library' onPress={handlePick} iconName='images' />
				<IconButton label='Camera' onPress={() => setUseCamera(true)} iconName='camera' />
			</View>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginVertical: 10,
	},
	preview: {
		borderRadius: 8,
		marginVertical: 10,
	},
	controls: {
		flexDirection: 'row',
		gap: 20,
	},
	errorText: {
		color: 'red',
		marginTop: 10,
	},
})
