// apps/web/src/utils/selectImage.ts

import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { extractExif, getSafeImageData } from './image'

export const selectImage = async () => {
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync()
    
    if (!permission.granted) {
        console.log('Permission denied.')
        return null
    }
    
	const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
		quality: 1,
	})
    
	if (result.canceled) {
        console.log('You did not select any image.')
        return
    }

	const asset = result.assets[0]
	const uri = asset.uri
    
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
}
