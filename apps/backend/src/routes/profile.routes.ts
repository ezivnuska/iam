// apps/backend/src/routes/profile.routes.ts

import express, { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import { setAvatarImage, updateSelf, changePassword, getProfile } from '../controllers/profile.controller'

const router: express.Router = Router()

router.get('/', requireAuth(), getProfile)
router.put('/', requireAuth(), updateSelf)
router.put('/password', requireAuth(), changePassword)
router.patch('/avatar/:imageId', requireAuth(), setAvatarImage)

export default router
