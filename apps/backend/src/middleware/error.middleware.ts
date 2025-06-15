// apps/backend/src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../utils/HttpError'

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
	if (err instanceof HttpError) {
		const { message, status, details } = err

		if (details && 'field' in details && 'issue' in details) {
			res.status(status).json({
				error: {
					message,
					details: [details.field, details.issue],
				},
			})
            return
		}

		res.status(status).json({ error: { message, details } })
        return
	}

	console.error('Unhandled error:', err)
	res.status(500).json({ error: { message: 'Internal Server Error' } })
}
