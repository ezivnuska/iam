// packages/auth/src/types.ts

export enum UserRole {
	User = 'user',
	Admin = 'admin',
}

export type TokenPayload = {
    id: string
    username: string
    email: string
    role: UserRole
}