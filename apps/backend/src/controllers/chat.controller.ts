// apps/backend/src/controllers/chat.controller.ts

import { Server, Socket } from 'socket.io'

export const registerChatHandlers = (io: Server, socket: Socket) => {
	console.log(`Chat handlers attached to ${socket.id}`)
  
	const onChatMessage = (message: string) => {

		if (typeof message !== 'string') {
			console.warn(`Invalid message from ${socket.id}`, message)
			return
		}
		
		io.emit('chat:message', {
			id: socket.id,
			text: message,
			timestamp: new Date(),
		})
	}
  
	socket.on('chat:message', onChatMessage)
  
	socket.on('disconnect', () => {
		console.log(`Socket disconnected, cleaning chat handlers: ${socket.id}`)
		socket.off('chat:message', onChatMessage)
	})
}
  