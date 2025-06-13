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
    scrapePostLinkPreview,
} from '../controllers/post.controller'
import { optionalAuth } from '../middleware/optionalAuth.middleware'
import { requireAuth } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router: Router = Router()

router.post('/scrape', asyncHandler(scrapePost))
router.patch('/posts/:id/scrape', asyncHandler(scrapePostLinkPreview))
router.get('/', optionalAuth, asyncHandler(getAllPosts))
router.get('/:id', asyncHandler(getPostById))
router.post('/', requireAuth(), asyncHandler(createPost))
router.put('/:id', requireAuth(), asyncHandler(updatePost))
router.delete('/:id', requireAuth(), asyncHandler(deletePost))
router.get('/:postId/likes', asyncHandler(getPostLikes))
router.post('/:postId/like', requireAuth(), asyncHandler(toggleLike))

export default router