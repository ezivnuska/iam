// apps/backend/src/controllers/presence.controller.ts

import { Server, Socket } from 'socket.io'

const onlineUsers = new Map<string, string>()

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
	const userId = socket.data.user?.id
	if (!userId) return

	onlineUsers.set(userId, socket.id)

	socket.emit('presence:init', Array.from(onlineUsers.keys()))

	socket.broadcast.emit('presence:online', userId)

	socket.on('disconnect', () => {
		onlineUsers.delete(userId)
		io.emit('presence:offline', userId)
	})
}
