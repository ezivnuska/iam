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
	Bond,
	ClientToServerEvents,
	ServerToClientEvents,
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
	onBondCreated: (cb: (bond: Bond) => void) => () => void
	onBondUpdated: (cb: (bond: Bond) => void) => () => void
	onBondDeleted: (cb: (bondId: string) => void) => () => void
	onBondError: (cb: (error: string) => void) => () => void
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined)

const SOCKET_URL = process.env.SOCKET_URL!

type SocketProviderProps = {
	children: ReactNode
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
	const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
	const [socket, setSocket] = useState<Socket | null>(null)

	const bondListenersRef = useRef({
		created: [] as ((bond: Bond) => void)[],
		updated: [] as ((bond: Bond) => void)[],
		deleted: [] as ((id: string) => void)[],
		error: [] as ((msg: string) => void)[],
	})

	const connectSocket = (token: string) => {
		if (!token) return
        console.log('connecting socket...')
		if (socketRef.current) {
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
			console.log('Socket connected:', socketInstance.id)
		})

		socketInstance.on('disconnect', () => {
			console.log('Socket disconnected')
		})

		socketInstance.on('connect_error', (err) => {
			console.error('Socket connection error:', err.message)
		})

		socketRef.current = socketInstance
		setSocket(socketInstance)
	}

	const disconnectSocket = () => {
        console.log('disconnecting socket...')
		if (socketRef.current) {
			console.log('Socket manually disconnected')
			socketRef.current.disconnect()
			socketRef.current = null
			setSocket(null)
		}
	}

	// ----------- Event Listeners -----------
	const onDonation = (cb: (data: KoFiDonation) => void) => {
		socketRef.current?.on('kofi:donation', cb)
		return () => socketRef.current?.off('kofi:donation', cb)
	}

	const onChatMessage = (cb: (msg: any) => void) => {
		socketRef.current?.on('chat:message', cb)
		return () => socketRef.current?.off('chat:message', cb)
	}

	// ----------- Event Emitters -----------
	const emitChatMessage = (msg: string) => {
		socketRef.current?.emit('chat:message', msg)
	}

	const emitBondCreate = (responderId: string) => {
		socketRef.current?.emit('bond:create', { responder: responderId })
	}

	const emitBondUpdate = (bondId: string, status: { confirmed?: boolean; declined?: boolean; cancelled?: boolean }) => {
		socketRef.current?.emit('bond:update', { bondId, status })
	}

	const emitBondDelete = (bondId: string) => {
		socketRef.current?.emit('bond:delete', { bondId })
	}

	// ----------- Bond Listeners -----------
	const onBondCreated = (cb: (bond: Bond) => void) => {
		bondListenersRef.current.created.push(cb)
		socketRef.current?.on('bond:created', cb)
		return () => {
			bondListenersRef.current.created = bondListenersRef.current.created.filter(fn => fn !== cb)
			socketRef.current?.off('bond:created', cb)
		}
	}

	const onBondUpdated = (cb: (bond: Bond) => void) => {
		bondListenersRef.current.updated.push(cb)
		socketRef.current?.on('bond:updated', cb)
		return () => {
			bondListenersRef.current.updated = bondListenersRef.current.updated.filter(fn => fn !== cb)
			socketRef.current?.off('bond:updated', cb)
		}
	}

	const onBondDeleted = (cb: (bondId: string) => void) => {
		bondListenersRef.current.deleted.push(cb)
		socketRef.current?.on('bond:deleted', cb)
		return () => {
			bondListenersRef.current.deleted = bondListenersRef.current.deleted.filter(fn => fn !== cb)
			socketRef.current?.off('bond:deleted', cb)
		}
	}

	const onBondError = (cb: (error: string) => void) => {
		bondListenersRef.current.error.push(cb)
		socketRef.current?.on('bond:error', cb)
		return () => {
			bondListenersRef.current.error = bondListenersRef.current.error.filter(fn => fn !== cb)
			socketRef.current?.off('bond:error', cb)
		}
	}

	const value = useMemo(() => ({
		socket,
		connectSocket,
		disconnectSocket,
		onDonation,
		onChatMessage,
		emitChatMessage,
		emitBondCreate,
		emitBondUpdate,
		emitBondDelete,
		onBondCreated,
		onBondUpdated,
		onBondDeleted,
		onBondError,
	}), [socket])

	return (
		<SocketContext.Provider value={value}>
			{children}
		</SocketContext.Provider>
	)
}
