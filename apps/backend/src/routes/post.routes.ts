// apps/backend/src/routes/post.routes.ts

import express, { Router } from 'express'
import {
	getAllPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
    scrapePost,
} from '../controllers/post.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router: Router = Router()

router.post('/scrape', asyncHandler(scrapePost))
router.get('/', asyncHandler(getAllPosts))
router.get('/:id', asyncHandler(getPostById))
router.post('/', requireAuth(), asyncHandler(createPost))
router.put('/:id', requireAuth(), asyncHandler(updatePost))
router.delete('/:id', requireAuth(), asyncHandler(deletePost))

export default router