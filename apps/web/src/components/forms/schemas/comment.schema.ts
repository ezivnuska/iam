// apps/web/src/forms/schemas/comment.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/types'

export const commentSchema = z.object({
	content: z.string(),
})

export type CommentFormValues = z.infer<typeof commentSchema>

export const commentFields: FieldConfig<CommentFormValues>[] = [
	{ name: 'content', label: 'Add a comment' }
]
