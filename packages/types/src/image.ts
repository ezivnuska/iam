// packages/types/src/image.ts

import { Document, Types } from 'mongoose'

export interface ImageVariant {
    size: string
    filename: string
    width: number
    height: number
}

export interface ImageDocument extends Document {
	_id: Types.ObjectId
	filename: string
	username: string
	alt?: string
	url?: string
    variants: ImageVariant[]
    likes: Types.ObjectId[]
}

export interface Image {
	id: string
	filename: string
	username: string
	url: string
	alt?: string
    variants: ImageVariant[]
    likes: string[]
    likedByCurrentUser: boolean
}

export type UploadedImage = {
	id: string
	filename: string
	username: string
	alt: string
	url: string
	createdAt: string
	updatedAt: string
	variants: ImageVariant[]
}

