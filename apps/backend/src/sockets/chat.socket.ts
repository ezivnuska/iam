// apps/backend/src/sockets/chat.socket.ts

import { Server, Socket } from 'socket.io'

type ChatMessage = {
	id: string
	text: string
	timestamp: Date
}

export const handleChatSocket = (io: Server, socket: Socket) => {
	console.log(`Chat socket connected: ${socket.id}`)

	const broadcastMessage = (text: string) => {
		const payload: ChatMessage = {
			id: socket.id,
			text,
			timestamp: new Date(),
		}
		io.emit('chat:message', payload)
	}

	socket.on('chat:message', (message: string) => {
		console.log(`${socket.id}: ${message}`)
		broadcastMessage(message)
	})
}
