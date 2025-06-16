// apps/web/src/hooks/usePresence.ts

import { useEffect, useState } from 'react'
import { useSocket } from './useSocket'

export const usePresence = () => {
	const { socket } = useSocket()
	const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

	useEffect(() => {
		if (!socket) return
	
		const handleInit = (onlineUserIds: string[]) => {
			setOnlineUsers(new Set(onlineUserIds))
		}
	
		const handleOnline = (userId: string) => {
			setOnlineUsers(prev => new Set(prev).add(userId))
		}
	
		const handleOffline = (userId: string) => {
			setOnlineUsers(prev => {
				const updated = new Set(prev)
				updated.delete(userId)
				return updated
			})
		}
	
		socket.on('presence:init', handleInit)
		socket.on('presence:online', handleOnline)
		socket.on('presence:offline', handleOffline)
	
		return () => {
			socket.off('presence:init', handleInit)
			socket.off('presence:online', handleOnline)
			socket.off('presence:offline', handleOffline)
		}
	}, [socket])	

	const isOnline = (userId: string) => onlineUsers.has(userId)

	return { onlineUsers, isOnline }
}
