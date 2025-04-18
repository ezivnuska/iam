// apps/backend/src/routes/auth.routes.ts

import { Router } from 'express'
import {
  signup,
  signin,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller'

const router: ReturnType<typeof Router> = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/refresh-token', refreshToken)
router.post('/logout', logout)

router.get('/verify', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
