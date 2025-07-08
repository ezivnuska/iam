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
import { requireRefreshToken } from '../middleware/requireRefreshToken'
import { validate } from '../middleware/validate.middleware'
import {
	signupSchema,
	signinSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} from '../schemas/auth.schema'

const router: express.Router = Router()

router.post('/signin', validate(signinSchema), signin)
router.post('/signup', validate(signupSchema), signup)
router.post('/refresh-token', requireRefreshToken, refreshToken)
router.post('/logout', logout)
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)
router.get('/verify-email', validate(verifyEmailSchema), verifyEmail)

export default router
