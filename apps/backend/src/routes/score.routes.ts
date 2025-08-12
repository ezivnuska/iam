// apps/backend/src/routes/score.routes.ts

import express, { Router } from 'express'
import { addScore, clearScores, getScores } from '../controllers/score.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router: express.Router = Router()

router.post('/', requireAuth(), addScore)
router.get('/', getScores)
router.delete('/', clearScores)

export default router
