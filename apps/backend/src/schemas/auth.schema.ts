// apps/backend/src/schemas/auth.schema.ts

import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
})

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(6),
})

export const verifyEmailSchema = z.object({
	token: z.string().min(10),
})
