// packages/services/src/utils/uriToFile.ts

export async function uriToFile(uri: string, filename: string): Promise<File> {
	const res = await fetch(uri)
	const blob = await res.blob()
	return new File([blob], filename, { type: blob.type || 'image/jpeg' })
}
