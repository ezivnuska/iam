// apps/backend/src/routes/auth.routes.ts

import express, { Router } from 'express'
import {
	signup,
	signin,
	refreshToken,
	logout,
	verifyEmail,
	forgotPassword,
	resetPassword,
} from '../controllers/auth.controller'
import { validate } from '../middleware/validate.middleware'
import {
	signupSchema,
	signinSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} from '../schemas/auth.schema'

const router: Router = Router()

// Auth routes
router.post('/signin', validate(signinSchema), signin)
router.post('/signup', validate(signupSchema), signup)
router.post('/refresh-token', refreshToken)
router.post('/logout', logout)

// Account recovery
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validate(resetPasswordSchema), resetPassword)

// Email verification
router.get('/verify-email', validate(verifyEmailSchema), verifyEmail)

export default router
