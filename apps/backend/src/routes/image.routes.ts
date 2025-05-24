// apps/backend/src/routes/image.routes.ts

import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import { uploadMemory } from '../middlewares/upload.middleware'
import { uploadImage, getImages, getUserImages, deleteImageController } from '../controllers/image.controller'

const router: Router = Router()

router.post( '/upload', requireAuth(), uploadMemory.single('image'), uploadImage)
router.get('/:username', requireAuth(), getUserImages)
router.get('/', requireAuth(), getImages)
router.delete('/:imageId', requireAuth(), deleteImageController)

export default router