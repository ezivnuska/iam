// apps/backend/src/routes/bond.routes.ts

import express, { Router } from 'express'
import * as bondController from '../controllers/bond.controller'
import { requireAuth} from '../middleware/auth.middleware'

const router: Router = Router()

router.post('/', requireAuth(), bondController.createBond)
router.put('/:id', requireAuth(), bondController.updateBondStatus)
router.get('/user/:userId', requireAuth(), bondController.getUserBonds)
router.delete('/:id', requireAuth(), bondController.deleteBond)

export default router
