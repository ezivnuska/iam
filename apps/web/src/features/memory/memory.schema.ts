// apps/web/src/features/memory/memory.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@shared/forms'
import type { UploadedImage } from '@iam/types'

export const memorySchema = z
	.object({
		content: z.string().max(280).optional(),
        image: z
            .custom<UploadedImage>()
            .optional()
            .nullable(),
	})

export const memoryFields: FieldConfig<MemoryFormValues>[] = [
    { name: 'content', autoFocus: true, placeholder: 'Remember...' },
]

export type MemoryFormValues = z.infer<typeof memorySchema>
