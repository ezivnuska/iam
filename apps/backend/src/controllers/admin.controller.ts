// apps/backend/src/controllers/admin.controller.ts

import { Request, RequestHandler, Response, NextFunction } from 'express'

export const getAdminDashboard: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Placeholder response — replace this with real admin data later
        res.json({
            message: 'Welcome to the Admin Dashboard',
            userCount: 128, // example static data
            systemStatus: 'OK'
        })
    } catch (err) {
        next(err)
    }
}