// apps/backend/src/routes/comment.routes.ts

import express, { Router } from 'express'
import { addComment, getComments, getCommentSummary } from '../controllers/comment.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router: express.Router = Router()

router.post('/', requireAuth(), addComment)
router.get('/:postId', getComments)
router.get('/summary/:postId', getCommentSummary)

export default router
