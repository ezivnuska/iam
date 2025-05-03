// apps/backend/src/routes/upload.routes.ts

import { RequestHandler, Router } from 'express'
import { upload } from '../middlewares/upload.middleware'
import { uploadImage } from '../controllers/upload.controller'

const router: Router = Router()

// Ensure proper middleware usage
router.post('/upload', upload.single('image') as RequestHandler, uploadImage)

export default router