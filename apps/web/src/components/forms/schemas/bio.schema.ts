// apps/web/src/components/forms/schemas/bio.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/types'

export const bioSchema = z
	.object({
		bio: z.string().min(1, 'Bio is required'),
	})

export type BioFormValues = z.infer<typeof bioSchema>

export const bioFields: FieldConfig<BioFormValues>[] = [
    { name: 'bio', autoFocus: true, placeholder: 'Who are you?' },
]

