// apps/web/src/shared/forms/ImageUploadForm.tsx

import React, { useState } from 'react'
import { Dimensions, Image, Platform, StyleSheet, Text } from 'react-native'
import { Column, Row } from '@shared/grid'
import { Button, IconButton } from '@shared/buttons'
import { NativeCamera, WebCamera } from '@shared/media'
import { uploadImage } from '@services'
import { selectImage } from '@shared/images'
import { useResponsiveImageSize } from '@shared/hooks'
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

type ImageUploadFormProps = {
	onUploaded?: (result: UploadedImage) => void
}

export const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onUploaded }) => {
	const [error, setError] = useState<string | null>(null)
	const [upload, setUpload] = useState<UploadType | null>(null)
	const [uploading, setUploading] = useState(false)
    const [useCamera, setUseCamera] = useState(false)

    const handleCapture = async (uri: string) => {
        const isBase64 = uri.startsWith('data:image/')
        const filename = isBase64
            ? `webcam_${Date.now()}.jpg`
            : uri.split('/').pop() || 'captured.jpg'
    
        let width: number | undefined
        let height: number | undefined

        await new Promise<void>((resolve) => {
            const img = new window.Image()
            img.onload = () => {
                width = img.width
                height = img.height
                resolve()
            }
            img.onerror = () => {
                console.warn('Could not load image for dimension detection')
                resolve()
            }
            img.src = uri
        })
    
        setUpload({
            uri,
            imageData: {
                uri,
                filename,
                width,
                height,
            },
        })
    
        setUseCamera(false)
    }    

	const handlePick = async () => {
		try {
            const selected = (await selectImage()) ?? null
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

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const maxPreviewHeight = screenHeight * 0.6

    const { width: rawWidth, height: rawHeight } = useResponsiveImageSize(
        upload?.imageData.width,
        upload?.imageData.height
    )

    const aspectRatio = rawWidth && rawHeight ? rawWidth / rawHeight : 1

    const imageWidth = screenWidth * 0.9
    const imageHeight = Math.min(imageWidth / aspectRatio, maxPreviewHeight)

    const renderCamera = () => {
        if (Platform.OS === 'web') {
            return <WebCamera onCapture={handleCapture} onCancel={() => setUseCamera(false)} />
        } else {
            return <NativeCamera onCapture={handleCapture} onCancel={() => setUseCamera(false)} />
        }
    }

	return useCamera
        ? renderCamera()
        : (
            <Column spacing={10} style={styles.container}>
                {upload && (
                    <Image
                        source={{ uri: upload.uri }}
                        style={[styles.imagePreview, { width: imageWidth, height: imageHeight }]}
                        resizeMode='contain'
                    />
                )}
                <Text style={styles.errorText}>{error ? error : ' '}</Text>
                <Row align='center' spacing={30} style={styles.controls}>
                    <IconButton
                        label='Library'
                        onPress={handlePick}
                        iconName='images'
                        showLabel={upload ? false : true}
                    />
                    <IconButton
                        label='Camera'
                        onPress={() => setUseCamera(true)}
                        iconName='camera'
                        showLabel={upload ? false : true}
                    />
                    {upload && (
                        <Button
                            label='Upload'
                            onPress={handleSubmit}
                            showActivity={uploading}
                        />
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