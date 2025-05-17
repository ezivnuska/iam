// apps/backend/src/models/user.model.ts

import mongoose, { Schema } from 'mongoose'
import { UserDocument } from '@iam/types'
import { UserRole } from '@iam/types'
  
const UserSchema = new Schema<UserDocument>({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
    bio: { type: String },
    avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: undefined },
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

function isPopulatedAvatar(
	obj: unknown
): obj is { filename: string } {
	return typeof obj === 'object' && obj !== null && 'filename' in obj
}

UserSchema.virtual('avatarUrl').get(function () {
	if (isPopulatedAvatar(this.avatar) && this.username) {
		return `/images/users/${this.username}/${this.avatar.filename}`
	}
	return undefined
})

UserSchema.set('toJSON', { virtuals: true })
UserSchema.set('toObject', { virtuals: true })

export const UserModel = mongoose.model<UserDocument>('User', UserSchema)