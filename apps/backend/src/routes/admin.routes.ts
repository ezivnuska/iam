// apps/backend/src/routes/admin.routes.ts

import express, { Router } from 'express'
import { getAdminDashboard } from '../controllers/admin.controller'
import { requireAuth } from '../middleware/authMiddleware'
import { UserRole } from '@auth'

const router: express.Router = Router()

router.get('/dashboard', requireAuth([UserRole.Admin]), getAdminDashboard)

export default router