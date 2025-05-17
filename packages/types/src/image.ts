// packages/types/src/image.ts

import { Document, Types } from 'mongoose'

// DB-level schema
export interface ImageDocument extends Document {
	_id: Types.ObjectId
	filename: string
	username: string
	width?: number
	height?: number
	alt?: string
	url?: string
}

// Normalized version for client use
export interface Image {
	id: string
	filename: string
	username: string
	url: string
	width?: number
	height?: number
	alt?: string
}