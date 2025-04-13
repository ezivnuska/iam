// packages/types/src/token.ts

export type TokenPayload = {
    sub: string         // subject (user ID)
    email: string
    role: 'user' | 'admin' | 'moderator'
    exp: number         // expiration timestamp (Unix)
    iat?: number        // issued at (optional)
}