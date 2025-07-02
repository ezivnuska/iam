// apps/web/src/forms/schemas/comment.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/forms'

export const commentSchema = z
	.object({
		content: z.string().min(1, 'Required field'),
	})

export const commentFields: FieldConfig<CommentFormValues>[] = [
    { name: 'content', label: 'Add Comment', autoFocus: true, placeholder: 'comment...' },
]

export type CommentFormValues = z.infer<typeof commentSchema>
