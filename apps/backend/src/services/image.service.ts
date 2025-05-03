import { Image } from '../models/image.model'

export const createImage = async ({
	filename,
	username,
	alt,
}: {
	filename: string
	username: string
	alt?: string
}) => {
	return await Image.create({ filename, username, alt })
}