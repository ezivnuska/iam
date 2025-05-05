// apps/backend/src/types/image.types.ts

import { Document, Types } from 'mongoose'

export interface ImageDocument extends Document {
    _id: Types.ObjectId
    filename: string
    username: string
    width: number,
    height: number,
    alt: string
    url: string
}