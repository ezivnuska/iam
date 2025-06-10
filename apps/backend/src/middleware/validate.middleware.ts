// apps/backend/src/middleware/validate.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodSchema, ZodError } from 'zod'

export const validate =
	(schema: ZodSchema): RequestHandler =>
	(req: Request, res: Response, next: NextFunction): void => {
		try {
			req.body = schema.parse(req.body)
			next()
		} catch (err) {
			if (err instanceof ZodError) {
				res.status(400).json({
					error: 'Validation failed',
					details: err.errors,
				})
				return
			}
			next(err)
		}
	}
