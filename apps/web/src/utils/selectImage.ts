// apps/web/src/utils/selectImage.ts

import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { extractExif, getSafeImageData } from './image'

export const selectImage = async () => {
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync()
    
    if (!permission.granted) {
        alert('Permission denied.')
        return null
    }
    
	const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
		quality: 1,
	})
    
	if (result.canceled) {
        alert('You did not select any image.')
        return
    }

	const asset = result.assets[0]
	const uri = asset.uri
    alert(uri)
    
    if (Platform.OS === 'web') {
        const isBase64 = uri.startsWith('data:image/')
        let exif = {}
    
        if (!isBase64) {
            try {
                const res = await fetch(uri)
                const blob = await res.blob()
                exif = await extractExif(blob)
            } catch (e) {
                console.warn('EXIF extraction failed:', e)
            }
        }
    
        const { width, height, filename } = await getSafeImageData(uri, exif)
    
        return {
            uri,
            imageData: {
                uri,
                width,
                height,
                filename,
            },
        }
    }

    return {
		uri,
		imageData: {
			uri,
			width: asset.width ?? 800,
			height: asset.height ?? 600,
			filename: asset.fileName || `image-${Date.now()}.jpg`,
		},
	}
    
	// if (Platform.OS === 'web') {
	// 	const res = await fetch(uri)
    //     alert(res)
	// 	const blob = await res.blob()
	// 	const exif = await extractExif(blob)
	// 	const image = await loadImage(uri)

	// 	const { width, height, filename } = await handleImageData(image, exif)

	// 	return {
	// 		uri,
	// 		imageData: {
	// 			uri,
	// 			width,
	// 			height,
	// 			filename: filename || `image-${Date.now()}.jpg`,
	// 		},
	// 	}
	// } else {
	// 	// Native — skip EXIF/canvas
	// 	const image = {
	// 		uri,
	// 		height: asset.height,
	// 		width: asset.width,
	// 	}

	// 	return {
	// 		uri,
	// 		imageData: {
	// 			...image,
	// 			filename: asset.fileName || `image-${Date.now()}.jpg`,
	// 		},
	// 	}
	// }
}
