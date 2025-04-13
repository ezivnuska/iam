import type { UserInfo } from 'types'

export const isAdmin = (user: UserInfo) => user.role === 'admin'

export const hasRole = (user: UserInfo, role: string | string[]) => {
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.role)
}