// apps/web/src/lib/socket.ts

import { io, Socket } from 'socket.io-client'

// expected server-side events
interface ServerToClientEvents {
	'chat:message': (msg: { id: string; text: string; timestamp: string }) => void
	// more server -> client events
}

interface ClientToServerEvents {
	'chat:message': (msg: string) => void
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:4000', {
	withCredentials: true,
	transports: ['websocket'],
})