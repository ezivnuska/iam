//packages/types/src/user.ts

import { Document, Types } from 'mongoose'
import type { Image, ImageDocument } from './image'

export enum UserRole {
	User = 'user',
	Admin = 'admin',
}

// DB-level schema
export interface UserDocument extends Document {
	_id: Types.ObjectId
	username: string
	email: string
	role: UserRole
	bio: string
	avatar?: Types.ObjectId | ImageDocument
	password: string
	verified: boolean
	verifyToken?: string
	verifyTokenExpires?: Date
	resetPasswordToken?: string
	resetPasswordExpires?: Date
	createdAt: Date
	updatedAt: Date
}

// Normalized version for client/API use
export interface User {
	id: string
	username: string
	email: string
	role: UserRole
	bio: string
	avatar?: Image
	avatarUrl?: string // optional if needed for UI
	verified: boolean
	createdAt: string
	updatedAt: string
}

// Used in UI when only lightweight user data is needed
export interface PartialUser {
	username?: string
	avatar?: Image
    avatarUrl?: string
}