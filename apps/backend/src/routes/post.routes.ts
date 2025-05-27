// apps/backend/src/routes/post.routes.ts

import express, { Router } from 'express'
import {
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
    getPostLikes,
    scrapePost,
    toggleLike,
	updatePost,
} from '../controllers/post.controller'
import { optionalAuth } from '../middlewares/optionalAuth.middleware'
import { requireAuth } from '../middlewares/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router: Router = Router()

router.post('/scrape', scrapePost)
router.get('/', optionalAuth, asyncHandler(getAllPosts))
router.get('/:id', asyncHandler(getPostById))
router.post('/', requireAuth(), asyncHandler(createPost))
router.put('/:id', requireAuth(), asyncHandler(updatePost))
router.delete('/:id', requireAuth(), asyncHandler(deletePost))
router.get('/:postId/likes', requireAuth(), asyncHandler(getPostLikes))
router.post('/:postId/like', requireAuth(), asyncHandler(toggleLike))

export default router