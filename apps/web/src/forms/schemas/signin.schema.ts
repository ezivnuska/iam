// apps/web/src/forms/schemas/signin.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/forms'

export const signinSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(6, 'Password must be at least 6 characters'),
	})

export const signinFields: FieldConfig<SigninFormValues>[] = [
    { name: 'email', label: 'Email Address', autoFocus: true, keyboardType: 'email-address' },
    { name: 'password', label: 'Password', secure: true },
]

export type SigninFormValues = z.infer<typeof signinSchema>
