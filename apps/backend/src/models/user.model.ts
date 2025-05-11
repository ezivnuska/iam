// apps/backend/src/models/user.model.ts

import mongoose, { Schema, Document, Types } from 'mongoose'
import { UserRole } from '@auth'
import { ImageDocument } from '../types/image.types'

export interface IUser extends Document {
	_id: mongoose.Types.ObjectId
	username: string
	email: string
	role: UserRole
    bio: string
    avatar: Types.ObjectId | ImageDocument
	password: string
	verified: boolean
	verifyToken?: string
	verifyTokenExpires?: Date
	resetPasswordToken?: string
	resetPasswordExpires?: Date
	createdAt: Date
	updatedAt: Date
}
  
const UserSchema = new Schema<IUser>({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
    bio: { type: String },
    avatar: { type: Schema.Types.ObjectId, ref: 'Image' },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
	verifyToken: String,
	verifyTokenExpires: Date,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
}, {
	timestamps: true,
    toJSON: {
        virtuals: true,
    },
})

UserSchema.virtual('avatarUrl').get(function () {
	if (!this.avatar || !this.username) return null
	return `/images/users/${this.username}/${this.avatar}.webp` // adapt as needed
})

export const UserModel = mongoose.model<IUser>('User', UserSchema)