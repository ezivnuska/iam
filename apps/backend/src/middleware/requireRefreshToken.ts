// apps/backend/src/middleware/requireRefreshToken.ts

import { Request, Response, NextFunction } from 'express'

/**
 * Middleware to extract and validate a refresh token.
 * Supports:
 *   - Cookie (Web)
 *   - Body (Mobile/Native clients)
 *   - Header (x-refresh-token)
 */

export const requireRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    // Native - refreshToken in body
    const refreshToken = req.body.refreshToken

    // Web - handled via cookies (set by signin/signup)
    const cookieToken = req.cookies?.refreshToken

    req.refreshToken = refreshToken || cookieToken
    req.clientType = req.body.clientType || 'web'

    if (!req.refreshToken) {
        return res.status(401).json({ message: 'Missing refresh token' })
    }

    next()
}
