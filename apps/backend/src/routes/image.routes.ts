// apps/backend/src/routes/image.routes.ts

import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { uploadMemory } from '../middleware/upload.middleware'
import {
    uploadImage,
    getImages,
    getUserImages,
    deleteImageController,
    getLikes,
    toggleLike,
    getCommentCount,
} from '../controllers/image.controller'

const router: Router = Router()

router.post( '/upload', requireAuth(), uploadMemory.single('image'), uploadImage)
router.get('/:username', requireAuth(), getUserImages)
router.get('/', requireAuth(), getImages)
router.delete('/:imageId', requireAuth(), deleteImageController)
router.get('/:id/likes', requireAuth(), getLikes)
router.post('/:id/like', requireAuth(), toggleLike)
router.get('/:id/comments/count', requireAuth(), getCommentCount)

export default router