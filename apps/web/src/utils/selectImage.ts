// apps/web/src/utils/selectImage.ts

import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { extractExif, loadImage, handleImageData } from './image'

export const selectImage = async () => {
	const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
	if (!permission.granted) {
		alert('Permission denied.')
		return null
	}

	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ['images'],
		quality: 1,
	})

	if (result.canceled) return null

	const asset = result.assets[0]
	const uri = asset.uri

	if (Platform.OS === 'web') {
		const res = await fetch(uri)
		const blob = await res.blob()
		const exif = await extractExif(blob)
		const image = await loadImage(uri)
		return {
			uri,
			...(await handleImageData(image, exif)),
		}
	} else {
		// Native — skip EXIF/canvas
		const image = {
			uri,
			height: asset.height,
			width: asset.width,
		}

		return {
			uri,
			imageData: { ...image, filename: asset.fileName || `image-${Date.now()}.jpg` },
			thumbData: { ...image, filename: `thumb-${Date.now()}.jpg` },
		}
	}
}