// apps/backend/src/routes/comment.routes.ts

import express, { Router } from 'express'
import { addComment, getComments, getCommentSummary } from '../controllers/comment.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router: express.Router = Router()

router.post('/', requireAuth(), addComment)
router.get('/', getComments)
router.get('/summary', getCommentSummary)

export default router
