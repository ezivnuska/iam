// apps/backend/src/routes/admin.routes.ts

import express, { Router } from 'express'
import { getAdminDashboard } from '../controllers/admin.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { UserRole } from '@iam/types'

const router: express.Router = Router()

router.get('/dashboard', requireAuth([UserRole.Admin]), getAdminDashboard)

export default router