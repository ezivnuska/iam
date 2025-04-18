// apps/backend/src/routes/profile.routes.ts

import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { updateSelf, changePassword, getProfile } from '../controllers/profile.controller'

const router: ReturnType<typeof Router> = Router()

router.get('/', requireAuth(), getProfile)
router.put('/', requireAuth(), updateSelf)
router.put('/password', requireAuth(), changePassword)

export default router
