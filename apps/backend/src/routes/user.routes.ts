// app/backend/src/routes/user.routes.ts

import { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser
} from '../controllers/user.controller'
import { requireAuth } from '../middleware/authMiddleware'

const router: ReturnType<typeof Router> = Router()

router.use(requireAuth(['admin']))

router.get('/',         getAllUsers)
router.get('/:id',      getUserById)
router.put('/:id',      updateUser)
router.put('/:id/role', updateUserRole)
router.delete('/:id',   deleteUser)

export default router
