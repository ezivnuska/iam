// apps/backend/src/routes/kofi.routes.ts

import express, { Router } from 'express'
import { handleKoFi } from '../controllers/kofi.controller'

const router: Router = Router()

router.get('/', handleKoFi)

export default router
