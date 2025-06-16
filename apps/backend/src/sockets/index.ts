// apps/backend/src/sockets/index.ts

import { Server, Socket } from 'socket.io'
import { socketAuthMiddleware } from '../middleware/auth.middleware'
import { registerChatHandlers } from '../controllers/chat.controller'
import { registerBondHandlers } from '../controllers/bond.controller'
import { registerPresenceHandlers } from '../controllers/presence.controller'
import { bondEvents } from '../events/bond.events'

export const initSockets = (io: Server) => {
	io.use(socketAuthMiddleware)

    bondEvents.on('bond:created', (bond) => {
        io.to(bond.sender.toString()).emit('bond:created', bond)
        io.to(bond.responder.toString()).emit('bond:created', bond)
    })

    bondEvents.on('bond:updated', (bond) => {
        io.to(bond.sender.toString()).emit('bond:updated', bond)
        io.to(bond.responder.toString()).emit('bond:updated', bond)
    })

    bondEvents.on('bond:deleted', (bond) => {
        io.to(bond.sender.toString()).emit('bond:deleted', bond)
        io.to(bond.responder.toString()).emit('bond:deleted', bond)
    })

	io.on('connection', (socket: Socket) => {
		console.log(`Socket connected: ${socket.id}`)

		registerChatHandlers(io, socket)
        registerBondHandlers(io, socket)
		registerPresenceHandlers(io, socket)
		// registerNotificationHandlers(io, socket)

		socket.on('disconnect', () => {
			console.log(`Socket disconnected: ${socket.id}`)
		})
	})
}
