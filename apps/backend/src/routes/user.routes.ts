import { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser
} from '../controllers/user.controller'
import { authenticate, requireRole } from '../middlewares/authMiddleware'

const router: ReturnType<typeof Router> = Router()

router.use(authenticate, requireRole('admin'))

router.get('/',         getAllUsers)
router.get('/:id',      getUserById)
router.put('/:id',      updateUser)
router.put('/:id/role', updateUserRole)
router.delete('/:id',   deleteUser)

export default router
