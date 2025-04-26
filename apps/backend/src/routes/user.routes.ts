// app/backend/src/routes/user.routes.ts

import express, { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser
} from '../controllers/user.controller'
import { requireAuth } from '../middlewares/auth.middleware'
import { UserRole } from '@auth'

const router: express.Router = Router()

router.use(requireAuth())
// router.use(requireAuth([UserRole.Admin]))

router.get('/',         getAllUsers)
router.get('/:id',      getUserById)
router.put('/:id',      updateUser)
router.put('/:id/role', updateUserRole)
router.delete('/:id',   deleteUser)

export default router
