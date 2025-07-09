// apps/web/src/utils/error.ts

export const getErrorMessage = (err: unknown): string => {
	if (err instanceof Error) return err.message
	return typeof err === 'string' ? err : 'Unknown error'
}
