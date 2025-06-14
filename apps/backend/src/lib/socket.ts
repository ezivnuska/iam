// apps/backend/src/lib/socket.ts

import { Server } from 'socket.io'

let io: Server

export const registerSocketServer = (serverIO: Server) => {
	io = serverIO
}

export const getSocketServer = (): Server => {
	if (!io) throw new Error('Socket.io not initialized!')
	return io
}
