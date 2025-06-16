// apps/web/src/providers/SocketProvider.tsx

import React, {
	createContext,
	ReactNode,
	useMemo,
	useRef,
	useState,
} from 'react'
import { io, Socket } from 'socket.io-client'
import { getToken } from '@services'
import type {
	ServerToClientEvents,
	ClientToServerEvents,
} from '@iam/types'

type KoFiDonation = {
	from_name: string
	amount: string | number
	message: string
}

export type SocketContextType = {
	socket: Socket | null
	connectSocket: (token: string) => void
	disconnectSocket: () => void
	onDonation: (cb: (data: KoFiDonation) => void) => () => void
	onChatMessage: (cb: (msg: any) => void) => () => void
	emitChatMessage: (msg: string) => void

	// Bond-specific
	emitBondCreate: (responderId: string) => void
	emitBondUpdate: (bondId: string, status: { confirmed?: boolean, declined?: boolean, cancelled?: boolean }) => void
	emitBondDelete: (bondId: string) => void
	onBondCreated: (cb: (bond: any) => void) => () => void
	onBondUpdated: (cb: (bond: any) => void) => () => void
	onBondDeleted: (cb: (bondId: string) => void) => () => void
	onBondError: (cb: (error: string) => void) => () => void
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined)

const SOCKET_URL = process.env.SOCKET_URL!

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
	const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

	const connectSocket = (token: string) => {
        if (!token) {
            console.warn('No token found. Skipping socket connection.')
            return
        }

		if (socketRef.current) {
			console.warn('Socket already exists, reconnecting...')
			socketRef.current.disconnect()
		}

		const socketInstance = io(SOCKET_URL, {
			auth: { token },
			withCredentials: true,
			transports: ['websocket'],
			path: '/socket.io',
		})

		socketInstance.on('reconnect_attempt', async () => {
			const freshToken = await getToken()
			if (freshToken) {
				(socketInstance.auth as { token: string }).token = freshToken
			}
		})

		socketInstance.on('connect', () => {
			console.log('Connected to socket:', socketInstance.id)
		})

		socketInstance.on('disconnect', () => {
			console.log('Disconnected from socket')
		})

		socketInstance.on('connect_error', (err) => {
			console.error('Socket connection error:', err.message)
		})

		socketRef.current = socketInstance
		setSocket(socketInstance)
	}

	const disconnectSocket = () => {
		if (socketRef.current) {
			console.log('Disconnecting socket manually')
			socketRef.current.disconnect()
			socketRef.current = null
			setSocket(null)
		}
	}

	// Listeners
	const onDonation = (cb: (data: KoFiDonation) => void): (() => void) => {
		if (!socketRef.current) return () => {}
		socketRef.current.on('kofi:donation', cb)
		return () => socketRef.current?.off('kofi:donation', cb)
	}

	const onChatMessage = (cb: (msg: any) => void): (() => void) => {
		if (!socketRef.current) return () => {}
		socketRef.current.on('chat:message', cb)
		return () => socketRef.current?.off('chat:message', cb)
	}

	const emitChatMessage = (msg: string) => {
		if (socketRef.current?.connected) {
			socketRef.current.emit('chat:message', msg)
		} else {
			console.warn('Cannot send message. Socket not connected.')
		}
	}

	// BOND SOCKET EMITTERS
	const emitBondCreate = (responderId: string) => {
		socketRef.current?.emit('bond:create', { responder: responderId })
	}

	const emitBondUpdate = (bondId: string, status: { confirmed?: boolean; declined?: boolean; cancelled?: boolean }) => {
		socketRef.current?.emit('bond:update', { bondId, status })
	}

	const emitBondDelete = (bondId: string) => {
		socketRef.current?.emit('bond:delete', { bondId })
	}

	// BOND SOCKET LISTENERS
	const onBondCreated = (cb: (bond: any) => void): (() => void) => {
		socketRef.current?.on('bond:created', cb)
		return () => socketRef.current?.off('bond:created', cb)
	}

	const onBondUpdated = (cb: (bond: any) => void): (() => void) => {
		socketRef.current?.on('bond:updated', cb)
		return () => socketRef.current?.off('bond:updated', cb)
	}

	const onBondDeleted = (cb: (bondId: string) => void): (() => void) => {
		socketRef.current?.on('bond:deleted', cb)
		return () => socketRef.current?.off('bond:deleted', cb)
	}

	const onBondError = (cb: (error: string) => void): (() => void) => {
		socketRef.current?.on('bond:error', cb)
		return () => socketRef.current?.off('bond:error', cb)
	}

	const value = useMemo(
		() => ({
			socket,
			connectSocket,
			disconnectSocket,
			onDonation,
			onChatMessage,
			emitChatMessage,

			// BOND
			emitBondCreate,
			emitBondUpdate,
			emitBondDelete,
			onBondCreated,
			onBondUpdated,
			onBondDeleted,
			onBondError,
		}),
		[socket]
	)

	return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	)
}
