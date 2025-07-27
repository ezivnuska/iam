// apps/web/src/shared/images/ImageUpload.tsx

import React, { useState } from 'react'
import { Dimensions, Image, Platform, StyleSheet, Text } from 'react-native'
import { Row, Column } from '@shared/grid'
import { IconButton, Button } from '@shared/buttons'
import { NativeCamera, WebCamera } from '@shared/media'
import { selectImage } from '@shared/images'
import { useResponsiveImageSize } from '@shared/hooks'
import { uploadImage } from '@iam/services'
import type { UploadedImage } from '@iam/types'

type ImageDataType = {
	uri: string
	filename: string
	width?: number
	height?: number
}

type ImageUploadProps = {
	autoUpload?: boolean
	onImageSelected?: (imageData: ImageDataType) => void
	onUploaded?: (result: UploadedImage) => void
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
	autoUpload = false,
	onImageSelected,
	onUploaded,
}) => {
	const [error, setError] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)
	const [useCamera, setUseCamera] = useState(false)
	const [imageData, setImageData] = useState<ImageDataType | null>(null)

	const { width: rawWidth, height: rawHeight } = useResponsiveImageSize(
		imageData?.width,
		imageData?.height
	)

	const screenWidth = Dimensions.get('window').width
	const screenHeight = Dimensions.get('window').height
	const maxPreviewHeight = screenHeight * 0.6
	const aspectRatio = rawWidth && rawHeight ? rawWidth / rawHeight : 1
	const imageWidth = screenWidth * 0.9
	const imageHeight = Math.min(imageWidth / aspectRatio, maxPreviewHeight)

	const handleCapture = async (uri: string) => {
		const filename = uri.startsWith('data:image/')
			? `captured_${Date.now()}.jpg`
			: uri.split('/').pop() || `captured_${Date.now()}.jpg`

		const imgData: ImageDataType = { uri, filename }

		setImageData(imgData)
		setUseCamera(false)
		onImageSelected?.(imgData)
	}

	const handlePick = async () => {
		try {
			const selected = await selectImage()
			if (!selected) return
			setImageData(selected.imageData)
			onImageSelected?.(selected.imageData)
		} catch (err) {
			console.error(err)
			setError('Failed to pick image.')
		}
	}

	const handleUpload = async () => {
		if (!imageData) return
		setUploading(true)
		setError(null)
		try {
			const response = await uploadImage({ imageData })
			onUploaded?.(response)
		} catch (err) {
			console.error('Upload failed:', err)
			setError('Upload failed. Please try again.')
		} finally {
			setUploading(false)
		}
	}

	const renderCamera = () => {
		return Platform.OS === 'web' ? (
			<WebCamera onCapture={handleCapture} onCancel={() => setUseCamera(false)} />
		) : (
			<NativeCamera onCapture={handleCapture} onCancel={() => setUseCamera(false)} />
		)
	}

	return useCamera ? (
		renderCamera()
	) : (
		<Column spacing={10} style={styles.container}>
			{imageData && (
				<Image
					source={{ uri: imageData.uri }}
					style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 8 }}
					resizeMode='contain'
				/>
			)}
			{error && <Text style={styles.errorText}>{error}</Text>}
			<Row align='center'>
				<Row align='center' paddingVertical={10}>
					<IconButton label='Library' onPress={handlePick} iconName='images' showLabel={!imageData} />
					<IconButton label='Camera' onPress={() => setUseCamera(true)} iconName='camera' showLabel={!imageData} />
				</Row>
				{autoUpload && imageData && (
					<Button label='Upload' onPress={handleUpload} showActivity={uploading} />
				)}
			</Row>
		</Column>
	)
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imagePreview: {
    borderRadius: 8,
    maxWidth: '100%',
    maxHeight: 400,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
})
