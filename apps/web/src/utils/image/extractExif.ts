// apps/web/src/utils/image/extractExif.ts

import EXIF from 'exif-js'

export async function extractExif(blob: Blob): Promise<Record<string, any>> {
	return new Promise((resolve) => {
		const reader = new FileReader()

		reader.onload = function (e) {
			try {
				const buffer = e.target?.result as ArrayBuffer
				const exifData = EXIF.readFromBinaryFile(buffer)
				console.log('EXIF data extracted:', exifData)

				resolve(exifData || {})
			} catch (err) {
				console.warn('Failed to extract EXIF:', err)
				resolve({})
			}
		}

		reader.onerror = function (e) {
			console.error('Error reading blob for EXIF:', e)
			resolve({})
		}

		reader.readAsArrayBuffer(blob)
	})
}
