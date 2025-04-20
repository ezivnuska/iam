//packages/types/src/user.ts

export type UserRole = 'user' | 'admin'

export type User = {
	id: string
	username: string
	email: string
	role: UserRole
	verified: boolean
	verifyToken?: string
	verifyTokenExpires?: Date
	resetPasswordToken?: string
	resetPasswordExpires?: Date
	createdAt: Date
	updatedAt: Date
}