// apps/web/src/forms/schemas/bio.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '@/forms'

export const bioSchema = z
	.object({
		bio: z.string().min(1, 'Bio is required'),
	})

export type BioFormValues = z.infer<typeof bioSchema>

export const bioFields: FieldConfig<BioFormValues>[] = [
    { name: 'bio', label: 'Bio', autoFocus: true, placeholder: 'Who are you?' },
]

