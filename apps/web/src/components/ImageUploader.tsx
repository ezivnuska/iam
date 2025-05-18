// apps/web/src/components/ImageUploader.tsx

import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { Button, Column, SubmitButton } from './'
import { uploadImage } from '@services'
import { selectImage } from '@/utils'
import type { UploadedImage } from '@iam/types'

type ImageDataType = {
	uri: string
	height?: number
	width?: number
	filename: string
}

type UploadType = {
	uri: string
	imageData: ImageDataType
	thumbData?: ImageDataType
}

type ImageUploaderProps = {
	onUploaded?: (result: UploadedImage) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploaded }) => {
	const [error, setError] = useState<string | null>(null)
	const [upload, setUpload] = useState<UploadType | null>(null)
	const [uploading, setUploading] = useState(false)

	useEffect(() => {
		handlePick()
	}, [])

	const handlePick = async () => {
		try {
			const selected: { uri: string; imageData: { uri: string; filename: string } } | null = await selectImage()
			if (!selected) return

			setUpload(selected)

		} catch (err) {
			console.error(err)
			setError('Image not selected. Please try again.')
		}
	}

	const handleSubmit = async () => {
		if (!upload) return
	
		setUploading(true)
		setError(null)
	
		try {
			const response = await uploadImage({ imageData: upload.imageData })
			onUploaded?.(response)
		} catch (err) {
			console.error('Upload failed:', err)
			setError('Upload failed. Please try again.')
		} finally {
			setUploading(false)
		}
	}

	return (
		<View style={{ alignItems: 'center' }}>
			{upload && (
				<Button
					label='Change Image'
					onPress={handlePick}
				/>
			)}
			{upload && (
				<Column spacing={10}>
					<Image
						source={{ uri: upload.uri }}
						style={{ width: 200, height: 200, marginBottom: 10 }}
					/>
					<SubmitButton
						label='Upload Image'
						onPress={handleSubmit}
						submitting={uploading}
					/>
				</Column>
			)}
			{error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
		</View>
	)
}
