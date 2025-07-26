// apps/web/src/shared/forms/schemas/post.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/app/types'
import type { UploadedImage } from '@iam/types'

export const postSchema = z
	.object({
		content: z.string().max(280).optional(),
        image: z
            .custom<UploadedImage>()
            .optional()
            .nullable(),
	})

export const postFields: FieldConfig<PostFormValues>[] = [
    { name: 'content', autoFocus: true, placeholder: 'Say something...' },
]

export type PostFormValues = z.infer<typeof postSchema>
