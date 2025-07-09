// apps/backend/src/routes/like.routes.ts

import express, { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { optionalAuth } from '../middleware/optionalAuth.middleware'
import { getLikes, toggleLike, getLikeMeta } from '../controllers/like.controller'

const router: express.Router = Router()

router.get('/:refId/likes', optionalAuth, getLikes)
router.post('/:refId/like', requireAuth(), toggleLike)
router.get('/:refId/meta', optionalAuth, getLikeMeta)

export default router
