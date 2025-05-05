// apps/backend/src/controllers/chat.controller.ts

import { Server, Socket } from 'socket.io'

export const registerChatHandlers = (io: Server, socket: Socket) => {
	console.log(`Chat handlers attached to ${socket.id}`)

	socket.on('chat:message', (message) => {
		console.log(`💬 Received message from ${socket.id}:`, message)

		// Broadcast to all clients (including sender if needed)
		io.emit('chat:message', {
			id: socket.id,
			text: message,
			timestamp: new Date(),
		})
	})
}