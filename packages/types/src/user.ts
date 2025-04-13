// packages/types/src/user.ts

export type Role = 'user' | 'admin' | 'moderator'

export type UserInfo = {
	_id: string
	email: string
	username: string
	role: Role
}