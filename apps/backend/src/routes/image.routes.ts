// apps/backend/src/routes/image.routes.ts

import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import { uploadDisk } from '../middlewares/upload.middleware'
import { uploadImage, getImages, deleteImageController } from '../controllers/image.controller'

const router: Router = Router()

router.post('/upload', requireAuth(), uploadDisk.single('image'), uploadImage)
router.get('/', requireAuth(), getImages)
router.delete('/:imageId', requireAuth(), deleteImageController)

export default router