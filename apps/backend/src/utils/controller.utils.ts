// apps/backend/src/utils/controller.utils.ts

import { Request, Response } from 'express'

export function ensureUser(req: Request, res: Response): string | undefined {
	const userId = req.user?.id
	if (!userId) {
		res.status(401).json({ message: 'Unauthorized' })
		return undefined
	}
	return userId
}
