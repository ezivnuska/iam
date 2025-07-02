// apps/web/src/forms/schemas/signup.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/forms'

export const signupSchema = z
	.object({
		email: z.string().email(),
		username: z.string().min(3, 'Username must be at least 3 characters'),
		password: z.string().min(6),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export const signupFields: FieldConfig<SignupFormValues>[] = [
    { name: 'email', label: 'Email Address', autoFocus: true, keyboardType: 'email-address', placeholder: 'email' },
    { name: 'username', label: 'Username', placeholder: 'username' },
    { name: 'password', label: 'Password', secure: true, placeholder: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', secure: true, placeholder: 'confirm password' },
]

export type SignupFormValues = z.infer<typeof signupSchema>
