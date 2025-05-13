// apps/backend/src/routes/post.routes.ts

import express, { Router } from 'express'
import {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
} from '../controllers/post.controller'
import { requireAuth } from '../middlewares/auth.middleware'

const router: Router = Router()

router.get('/', getAllPosts)
router.get('/:id', getPostById)
router.post('/', requireAuth(), createPost)
router.put('/:id', requireAuth(), updatePost)
router.delete('/:id', requireAuth(), deletePost)

export default router