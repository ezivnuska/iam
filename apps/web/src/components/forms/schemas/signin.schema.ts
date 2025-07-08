// apps/web/src/components/forms/schemas/signin.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/types'

export const signinSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SigninFormValues = z.infer<typeof signinSchema>

export const signinFields: FieldConfig<SigninFormValues>[] = [
    { name: 'email', label: 'Email Address', autoFocus: true, placeholder: 'email', keyboardType: 'email-address' },
    { name: 'password', label: 'Password', secure: true, placeholder: 'password' },
]

