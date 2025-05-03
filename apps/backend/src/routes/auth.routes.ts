// apps/backend/src/routes/auth.routes.ts

import express, { Router } from 'express'
import {
  signup,
  signin,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller'
import { requireRefreshToken } from '../middlewares/requireRefreshToken'

const router: express.Router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)
router.post('/refresh-token', requireRefreshToken, refreshToken)

router.get('/verify', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
