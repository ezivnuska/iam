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

router.get('/', requireAuth(), getAllUsers)
router.get('/user/:username', requireAuth(), getUserByUsername)
router.get('/:id([a-fA-F0-9]{24})', requireAuth(), getUserById)
router.put('/:id', requireAuth(), updateUser)
router.put('/:id/role', requireAuth(), updateUserRole)
router.delete('/:id', requireAuth(), deleteUser)


export default router
