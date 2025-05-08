// apps/web/src/components/ImageUplad.tsx

import React, { useState } from 'react'
import { Text, Platform, Image } from 'react-native'
import { Button, Column } from '.'
import * as ImagePicker from 'expo-image-picker'
import { uploadImage } from '@services'
import type { ImageItem } from '@iam/types'

type NativeImageFile = {
	uri: string
	name: string
	type: string
	raw?: undefined
}

type WebImageFile = {
	uri: string
	name: string
	type: string
	raw: File
}

type ImageFile = NativeImageFile | WebImageFile

type ImageUploadProps = {
    onUploadSuccess: (image: ImageItem) => void
}

const ImageUpload = ({ onUploadSuccess }: ImageUploadProps) => {
	const [file, setFile] = useState<ImageFile | null>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handlePickImage = async () => {
		if (Platform.OS === 'web') {
			const input = document.createElement('input')
			input.type = 'file'
			input.accept = 'image/*'
			input.onchange = (e) => {
				const selectedFile = (e.target as HTMLInputElement).files?.[0]
				if (selectedFile) {
					setFile({
						uri: URL.createObjectURL(selectedFile),
						name: selectedFile.name,
						type: selectedFile.type,
						raw: selectedFile,
					} as any)
				}
			}
			input.click()
		} else {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: 'images',
				quality: 1,
			})

			if (!result.canceled) {
				const pickedFile: ImageFile = {
					uri: result.assets[0].uri,
					name: result.assets[0].fileName || 'image.jpg',
					type: 'image/jpeg',
				}
				setFile(pickedFile)
			}
		}
	}

	const handleSubmit = async () => {
        if (!file) return
    
        const formData = new FormData()
    
        if (Platform.OS === 'web') {
            if (file.raw) {
                formData.append('image', file.raw)
            } else {
                console.error('No file object found for web upload')
                setError('Upload failed: missing file data')
                return
            }
        } else {
            formData.append('image', {
                uri: file.uri,
                name: file.name,
                type: file.type,
            } as any) // 👈 necessary for React Native's FormData
        }
    
        // Optionally include other fields
        // formData.append('username', 'eric') // or dynamically use current user
    
        setIsUploading(true)
        setError(null)
    
        try {
            const response = await uploadImage(formData)
            const data: ImageItem = response.data
    
            onUploadSuccess(data)
            setFile(null)
        } catch (err) {
            console.error('Upload failed:', err)
            setError('Upload failed. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }    

	return (
		<Column spacing={10}>
			<Button label="Pick Image" onPress={handlePickImage} />
			{file && (
				<Column spacing={10}>
					<Image
						source={{ uri: file.uri }}
						style={{ width: 200, height: 200, borderRadius: 10 }}
						resizeMode="cover"
					/>
                    <Text style={{ marginTop: 10 }}>Selected file: {file.name}</Text>
					<Button
						label={isUploading ? 'Uploading...' : 'Upload Image'}
						onPress={handleSubmit}
						disabled={isUploading}
					/>
				</Column>
			)}
			{error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
		</Column>
	)
}

export default ImageUpload