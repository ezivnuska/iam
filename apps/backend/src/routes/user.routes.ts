// app/backend/src/routes/user.routes.ts

import express, { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router: express.Router = Router()

router.use(requireAuth())

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.get('/user/:username', getUserByUsername)
router.put('/:id', updateUser)
router.put('/:id/role', updateUserRole)
router.delete('/:id',   deleteUser)


export default router
