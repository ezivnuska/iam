// apps/backend/src/models/image.model.ts

import { Schema, model } from 'mongoose'
import type { ImageDocument } from '@iam/types'

const VariantSchema = new Schema(
	{
		size: { type: String, required: true },
		filename: { type: String, required: true },
		width: { type: Number, required: true },
		height: { type: Number, required: true },
	},
	{ _id: false }
)

const ImageSchema = new Schema<ImageDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		username: { type: String, required: true },
		filename: { type: String, required: true },
		alt: { type: String, default: '' },
		variants: {
			type: [VariantSchema],
			default: [],
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
			transform: (_doc, ret) => {
				ret.id = ret._id.toString()
				delete ret._id
				delete ret.__v

				if (Array.isArray(ret.variants)) {
					ret.variants = ret.variants.map(({ url, ...rest }) => rest)
				}

				return ret
			},
		},
	}
)

ImageSchema.virtual('url').get(function (this: ImageDocument) {
	if (!this.username || !this.filename) return ''
	return `/images/users/${this.username}/${this.filename}`
})

export const ImageModel = model('Image', ImageSchema)
