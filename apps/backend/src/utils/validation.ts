// apps/backend/src/utils/validation.ts

import { ZodError } from 'zod'

export function formatZodErrors(error: ZodError) {
	const fieldErrors: Record<string, string> = {}

	for (const issue of error.issues) {
		const path = issue.path.join('.') || 'form'
		// Only show first error per field
		if (!fieldErrors[path]) {
			fieldErrors[path] = issue.message
		}
	}

	return fieldErrors
}
