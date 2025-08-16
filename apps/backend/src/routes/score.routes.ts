// apps/backend/src/routes/score.routes.ts

import express, { Router } from 'express'
import { addScore, clearScores, getScores } from '../controllers/score.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { optionalAuth } from '../middleware/optionalAuth.middleware'

const router: express.Router = Router()

router.post('/', requireAuth(), addScore)
router.get('/', optionalAuth ,getScores)
router.delete('/', clearScores)

export default router
