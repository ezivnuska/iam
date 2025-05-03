// apps/backend/src/types/image.types.ts

import { Document } from 'mongoose'

export interface ImageDocument extends Document {
    filename: string
    username: string
    width: number,
    height: number,
    alt: string
    url: string
}