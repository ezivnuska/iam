// apps/backend/src/sockets/index.ts

import { Server, Socket } from 'socket.io'
import { socketAuthMiddleware } from '../middleware/auth.middleware'
import { registerChatHandlers } from '../controllers/chat.controller'
import { registerBondHandlers } from '../controllers/bond.controller'
import { registerPresenceHandlers } from '../controllers/presence.controller'

export const initSockets = (io: Server) => {
	io.use(socketAuthMiddleware)

	io.on('connection', (socket: Socket) => {
		console.log(`Socket connected: ${socket.id}`)

		registerChatHandlers(io, socket)
        registerBondHandlers(io, socket)
		registerPresenceHandlers(io, socket)

		socket.on('disconnect', () => {
			console.log(`Socket disconnected: ${socket.id}`)
		})
	})
}
