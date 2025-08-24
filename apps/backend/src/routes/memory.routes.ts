// apps/backend/src/routes/memory.routes.ts

import express, { Router } from 'express'
import {
	createMemory,
	deleteMemory,
	deleteMemoryImage,
	getAllMemories,
	getMemoryById,
	updateMemory,
} from '../controllers/memory.controller'
import { optionalAuth } from '../middleware/optionalAuth.middleware'
import { requireAuth } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router: Router = Router()

router.get('/', optionalAuth, asyncHandler(getAllMemories))
router.get('/:id', asyncHandler(getMemoryById))
router.post('/', requireAuth(), asyncHandler(createMemory))
router.put('/:id', requireAuth(), asyncHandler(updateMemory))
router.put('/:id/image/delete', requireAuth(), asyncHandler(deleteMemoryImage))
router.delete('/:id', requireAuth(), asyncHandler(deleteMemory))

export default router