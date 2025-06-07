// apps/backend/src/utils/ensureAuth.ts

import { Request, Response } from 'express'

export const ensureAuth = (req: Request, res: Response): string | null => {
    const userId = req.user?.id
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' })
        return null
    }
    return userId
}
