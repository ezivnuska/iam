// apps/backend/src/models/user.model.ts

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
	email: string
	username: string
	password: string
	role: string
	verified: boolean
	verifyToken?: string
	verifyTokenExpires?: Date
	resetPasswordToken?: string
	resetPasswordExpires?: Date
	createdAt: Date
	updatedAt: Date
}

const UserSchema: Schema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		username: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, default: 'user' },
		verified: { type: Boolean, default: false },
		verifyToken: { type: String },
		verifyTokenExpires: { type: Date },
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
	},
	{
		timestamps: true,
	}
)

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)