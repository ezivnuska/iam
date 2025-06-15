// packages/types/src/socket.ts

import { ImageDocument, ImageVariant } from './image'

export type SocketUser = {
	id: string
	username: string
	role: string
	avatar?: {
		id: string
		filename: string
		username: string
		url?: string
		variants: ImageVariant[]
	}
}

export type ChatMessage = {
	user: SocketUser
	text: string
	timestamp: string
}

export type ServerToClientEvents = {
	'chat:message': (message: ChatMessage) => void
	'kofi:donation': (data: any) => void
}

export type ClientToServerEvents = {
	'chat:message': (message: string) => void
}
