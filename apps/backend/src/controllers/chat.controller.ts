// apps/backend/src/controllers/chat.controller.ts

import { Server, Socket } from 'socket.io'

export const registerChatHandlers = (io: Server, socket: Socket) => {
	console.log(`Chat handlers registered for socket: ${socket.id}`)

	socket.on('chat:message', (message: string) => {
		if (typeof message !== 'string') {
			console.warn(`⚠️ Invalid message from ${socket.id}`, message)
			return
		}

		console.log(`Message from ${socket.id}:`, message)

		io.emit('chat:message', {
			id: socket.id,
			text: message,
			timestamp: new Date(),
		})
	})
}
