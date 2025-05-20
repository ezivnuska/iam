// apps/web/src/components/ImageUploader.tsx

import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text } from 'react-native'
import { Button, CameraCapture, Column, FormHeader, FormLayout, Row, SubmitButton } from '../'
import { uploadImage } from '@services'
import { selectImage } from '@/utils'
import { useModal, useResponsiveImageSize } from '@/hooks'
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
}

type ImageUploaderProps = {
	onUploaded?: (result: UploadedImage) => void
}

export const ImageUploadForm: React.FC<ImageUploaderProps> = ({ onUploaded }) => {
	const [error, setError] = useState<string | null>(null)
	const [upload, setUpload] = useState<UploadType | null>(null)
	const [uploading, setUploading] = useState(false)
    const [useCamera, setUseCamera] = useState(false)

	const { hideModal } = useModal()

	// useEffect(() => {
	// 	handlePick()
	// }, [])

    const handleCapture = (uri: string) => {
        const filename = uri.split('/').pop() || 'captured.jpg'
        setUpload({
            uri,
            imageData: { uri, filename },
        })
        setUseCamera(false)
    }

	const handlePick = async () => {
		try {
			const selected: { uri: string; imageData: { uri: string; filename: string; width?: number; height?: number } } | null = await selectImage()
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
			const response: UploadedImage = await uploadImage({ imageData: upload.imageData })
			onUploaded?.(response)
		} catch (err) {
			console.error('Upload failed:', err)
			setError('Upload failed. Please try again.')
		} finally {
			setUploading(false)
		}
	}

    const { width: imageWidth, height: imageHeight } = useResponsiveImageSize(
        upload?.imageData.width,
        upload?.imageData.height
    )

	return (
		<FormLayout>
			<FormHeader title='Upload Image' onCancel={hideModal} />
            {useCamera ? (
                <CameraCapture onCapture={handleCapture} />
            ) : (
                <Column spacing={10}>
                    {upload && (
                        <Image
                            source={{ uri: upload.uri }}
                            style={[styles.imagePreview, { width: imageWidth, height: imageHeight }]}
                            resizeMode='contain'
                        />
                    )}
                    <Row spacing={10} style={styles.controls}>
                        <Button label='Select' onPress={handlePick} style={styles.button} />
                        <Button label="Use Camera" onPress={() => setUseCamera(true)} style={styles.button} />
                        {upload && (
                            <SubmitButton
                                label='Upload'
                                onPress={handleSubmit}
                                submitting={uploading}
                                style={styles.button}
                            />
                        )}
                    </Row>
                </Column>
            )}
			{error && <Text style={styles.errorText}>{error}</Text>}
		</FormLayout>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		padding: 20,
	},
	imagePreview: {
		borderRadius: 8,
	},
    controls: {
        //
    },
	button: {
        flex: 1,
		alignSelf: 'stretch',
	},
	errorText: {
		color: 'red',
		marginTop: 15,
	},
})