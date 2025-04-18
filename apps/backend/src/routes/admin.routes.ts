// apps/backend/src/routes/admin.routes.ts

import { Router } from 'express'
import { getAdminDashboard } from '../controllers/admin.controller'
import { requireAuth } from '../middleware/authMiddleware'

const router: ReturnType<typeof Router> = Router()

router.get('/dashboard', requireAuth(['admin']), getAdminDashboard)

export default router