//packages/types/src/user.ts

export type UserRole = 'user' | 'admin'

export interface Image {
    id: string
    filename: string
    username: string
    height: number
    width: number
    url: string
}

export type User = {
	id: string
	username: string
	email: string
	role: UserRole
    avatar?: Image
    avatarUrl?: string
    bio?: string
	verified: boolean
	verifyToken?: string
	verifyTokenExpires?: Date
	resetPasswordToken?: string
	resetPasswordExpires?: Date
	createdAt: Date
	updatedAt: Date
}