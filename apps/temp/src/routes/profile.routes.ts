// apps/backend/src/routes/profile.routes.ts

import express, { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { clearAvatar, setAvatarImage, updateSelf, changePassword, getProfile } from '../controllers/profile.controller'

const router: Router = Router()

router.get('/', requireAuth(), getProfile)
router.put('/', requireAuth(), updateSelf)
router.put('/password', requireAuth(), changePassword)
router.patch('/avatar/:imageId', requireAuth(), setAvatarImage)
router.delete('/avatar', requireAuth(), clearAvatar)


export default router
