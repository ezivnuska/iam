// apps/web/src/forms/schemas/chat.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/forms'

export const chatSchema = z
	.object({
		input: z.string().min(1, 'Field is required'),
	})

export const chatFields: FieldConfig<ChatFormValues>[] = [
    { name: 'input', autoFocus: true, placeholder: 'Say something...' },
]

export type ChatFormValues = z.infer<typeof chatSchema>
