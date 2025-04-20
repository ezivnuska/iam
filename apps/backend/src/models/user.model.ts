// apps/backend/src/models/user.model.ts

import mongoose, { Schema, Document } from 'mongoose'
import { UserRole } from '@auth'

export interface IUser extends Document {
	_id: mongoose.Types.ObjectId
	username: string
	email: string
	role: UserRole
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
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
	verifyToken: String,
	verifyTokenExpires: Date,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
}, {
	timestamps: true,
})

export const UserModel = mongoose.model<IUser>('User', UserSchema)