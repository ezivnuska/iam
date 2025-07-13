// apps/backend/src/routes/post.routes.ts

import express, { Router } from 'express'
import {
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
	updatePost,
} from '../controllers/post.controller'
import { optionalAuth } from '../middleware/optionalAuth.middleware'
import { requireAuth } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router: Router = Router()

router.get('/', optionalAuth, asyncHandler(getAllPosts))
router.get('/:id', asyncHandler(getPostById))
router.post('/', requireAuth(), asyncHandler(createPost))
router.put('/:id', requireAuth(), asyncHandler(updatePost))
router.delete('/:id', requireAuth(), asyncHandler(deletePost))

export default router