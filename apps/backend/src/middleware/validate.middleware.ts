// apps/backend/src/middleware/validate.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema): RequestHandler => (req: Request, res: Response, next: NextFunction): void => {
    const { success, data, error } = schema.safeParse(req.body)

    if (!success) {
        res.status(400).json({ error: 'Validation failed', details: error.errors })
        return
    }

    req.body = { ...req.body, ...data }
    next()
}
