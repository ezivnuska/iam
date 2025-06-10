// app/backend/src/routes/user.routes.ts

import express, { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router: express.Router = Router()

router.use(requireAuth())

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.put('/:id/role', updateUserRole)
router.delete('/:id',   deleteUser)


export default router
