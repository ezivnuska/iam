// apps/backend/src/routes/image.routes.ts

import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { optionalAuth } from '../middleware/optionalAuth.middleware'
import { uploadMemory } from '../middleware/upload.middleware'
import {
    uploadImage,
    getImages,
    // getUserImages,
    deleteImageController,
    getLikes,
    toggleLike,
    getCommentCount,
} from '../controllers/image.controller'

const router: Router = Router()

router.post( '/upload', requireAuth(), uploadMemory.single('image'), uploadImage)
router.get('/', requireAuth(), getImages)
router.get('/user/:userId', requireAuth(), getImages)
router.delete('/:imageId', requireAuth(), deleteImageController)
router.get('/:id/likes', optionalAuth, getLikes)
router.post('/:id/like', requireAuth(), toggleLike)
router.get('/:id/comments/count', getCommentCount)

export default router