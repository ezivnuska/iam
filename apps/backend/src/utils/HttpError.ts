// apps/backend/src/utils/HttpError.ts

export class HttpError extends Error {
	status: number
	details?: Record<string, any>

	constructor(
		message: string,
		status?: number,
		details?: Record<string, any>
	) {
		super(message)
		this.name = 'HttpError'
		this.status = HttpError.resolveStatus(message, status)
		this.details = details
		Error.captureStackTrace?.(this, HttpError)
	}

	static resolveStatus(message: string, status?: number) {
		// If explicitly provided, use it
		if (status) return status

		const lowerMsg = message.toLowerCase()

		// Guess based on message content
		if (lowerMsg.includes('not found')) return 404
		if (lowerMsg.includes('unauthorized') || lowerMsg.includes('invalid password')) return 401
		if (lowerMsg.includes('validation failed')) return 422

		return 500 // Default to server error
	}
}
