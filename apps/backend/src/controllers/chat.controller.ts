// apps/backend/src/controllers/chat.controller.ts

import { Server, Socket } from 'socket.io'
import type { ChatMessage, ServerToClientEvents, ClientToServerEvents, PartialUser } from '@iam/types'

export const registerChatHandlers = (
	io: Server<ClientToServerEvents, ServerToClientEvents>,
	socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
	console.log(`Chat handlers attached to ${socket.id}`)

	const user = socket.data.user as PartialUser | undefined

	const onChatMessage = (message: string) => {
		if (typeof message !== 'string') {
			console.warn(`Invalid message from ${socket.id}`, message)
			return
		}

		if (!user) {
			console.warn(`No user data found for socket ${socket.id}`)
			return
		}

		const payload: ChatMessage = {
			user: {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
			},
			text: message,
			timestamp: new Date().toISOString(),
		}

		console.log(`${user.username}: ${message}`)
		socket.broadcast.emit('chat:message', payload)
	}

	socket.on('chat:message', onChatMessage)

	socket.on('disconnect', () => {
		console.log(`Socket disconnected, cleaning chat handlers: ${socket.id}`)
		socket.off('chat:message', onChatMessage)
	})
}
