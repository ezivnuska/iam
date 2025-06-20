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
router.get('/', requireAuth(), getImages)
router.get('/user/:userId', requireAuth(), getUserImages)
router.delete('/:imageId', requireAuth(), deleteImageController)
router.get('/:id/likes', getLikes)
router.post('/:id/like', requireAuth(), toggleLike)
router.get('/:id/comments/count', getCommentCount)

export default router