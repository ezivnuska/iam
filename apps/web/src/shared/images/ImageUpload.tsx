// apps/web/src/shared/images/ImageUpload.tsx

import React, { useState } from 'react'
import { Dimensions, Image, LayoutChangeEvent, Platform, StyleSheet, Text, View } from 'react-native'
import { Row, Column } from '@shared/grid'
import { IconButton, Button } from '@shared/buttons'
import { NativeCamera, WebCamera } from '@shared/media'
import { selectImage } from '@shared/images'
import { useResponsiveImageSize } from '@shared/hooks'
import { uploadImage } from '@iam/services'
import type { UploadedImage } from '@iam/types'
import type { Dimensions as previewDims } from '@features/tiles'

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
    const [dims, setDims] = useState<previewDims>()

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
            console.log('selected', selected)
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

    const onLayout = async (e: LayoutChangeEvent) => {
        const { layout } = e.nativeEvent
        if (!layout) return
        let size = layout.height < layout.width ? layout.height : layout.width
        setDims({ width: size, height: size })
    }

	return useCamera ? (
		renderCamera()
	) : (
		<Column flex={1} spacing={10} style={styles.container} align='stretch'>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.previewContainer} onLayout={onLayout}>
                {imageData && dims && (
                    <Image
                        source={{ uri: imageData.uri }}
                        // style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 8 }}
                        style={[styles.imagePreview, { width: dims.width, height: dims.height }]}
                        // style={[styles.imagePreview, { width: imageWidth, height: imageHeight }]}
                        resizeMode='contain'
                    />
                )}
            </View>
			<Column align='center' spacing={10} style={{ width: '100%' }}>
				<Row flex={1} align='center' justify='space-evenly' style={{ width: '100%' }}>
					<IconButton label='Library' onPress={handlePick} iconName='images' showLabel={!imageData} />
					<IconButton label='Camera' onPress={() => setUseCamera(true)} iconName='camera' showLabel={!imageData} />
				</Row>
                {autoUpload && imageData && (
                    <Row flex={1} align='center' justify='space-evenly' style={{ width: '100%' }}>
                        <Button label='Upload' onPress={handleUpload} showActivity={uploading} />
                    </Row>
                )}
			</Column>
		</Column>
	)
}

const styles = StyleSheet.create({
    container: {
        // borderWidth: 1,
        // borderColor: 'red',
        // alignItems: 'center',
    },
    previewContainer: {
        flex: 1,
        width: '100%',
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
