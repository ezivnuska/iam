// apps/backend/src/middlewares/optionalAuth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { TokenPayload, verifyToken } from '@auth'

export const optionalAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const payload = verifyToken(token)
      req.user = payload
    } catch (err) {
      // Invalid token, just ignore and proceed without user
      // Optionally log error here if you want
    }
  }

  next()
}
