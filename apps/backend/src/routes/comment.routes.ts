// apps/backend/src/routes/comment.routes.ts

import express, { Router } from 'express'
import { addComment, deleteComment, getComments, getCommentSummary } from '../controllers/comment.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router: express.Router = Router()

router.post('/', requireAuth(), addComment)
router.get('/', getComments)
router.get('/summary', getCommentSummary)
router.delete('/:commentId', requireAuth(), deleteComment)

export default router
