// apps/web/src/shared/forms/schemas/memory.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '../'
import type { UploadedImage } from '@iam/types'

export const memorySchema = z
	.object({
		content: z.string().max(280).optional(),
		// year: z.number(),
		// month: z.number(),
		// day: z.number(),
        image: z
            .custom<UploadedImage>()
            .optional()
            .nullable(),
	})

export const memoryFields: FieldConfig<MemoryFormValues>[] = [
    { name: 'content', autoFocus: true, placeholder: 'Remember...' },
]

export type MemoryFormValues = z.infer<typeof memorySchema>
