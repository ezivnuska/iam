// packages/auth/src/types.ts

import type { UserRole } from '@iam/types'

export type TokenPayload = {
    id: string
    username: string
    email: string
    role: UserRole
}