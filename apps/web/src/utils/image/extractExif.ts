// apps/web/src/utils/image/extractExif.ts

import EXIF from 'exif-js'

export async function extractExif(blob: Blob): Promise<Record<string, any>> {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.onload = function (e) {
			const exifData = EXIF.readFromBinaryFile(e.target?.result as ArrayBuffer)
			resolve(exifData || {})
		}
		reader.readAsArrayBuffer(blob)
	})
}