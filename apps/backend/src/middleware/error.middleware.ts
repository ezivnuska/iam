// apps/backend/src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../utils/HttpError'

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
	if (err instanceof HttpError) {
		const { message, status, details } = err

		// Normalize { field, issue } into [field, issue] for the frontend
		if (details && 'field' in details && 'issue' in details) {
			return res.status(status).json({
				error: {
					message,
					details: [details.field, details.issue],
				},
			})
		}

		// Default structured HttpError
		return res.status(status).json({ error: { message, details } })
	}

	console.error('Unhandled error:', err)
	res.status(500).json({ error: { message: 'Internal Server Error' } })
}
