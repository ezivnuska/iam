// models/image.model.ts

import { Schema, model } from 'mongoose'
import type { ImageDocument } from '../types/image.types'

const ImageSchema = new Schema<ImageDocument>(
	{
		filename: { type: String, required: true },
		username: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
		alt: { type: String, default: '' },
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
	}
)

ImageSchema.virtual('url').get(function (this: ImageDocument) {
	return `/images/${this.username}/${this.filename}`
})

export const Image = model('Image', ImageSchema)