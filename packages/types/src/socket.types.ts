// packages/types/src/socket.types.ts

import { ImageDocument, ImageVariant } from './image'
import type { IBond } from './bond.types'

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

export interface ServerToClientEvents {
	'chat:message': (message: ChatMessage) => void
	'kofi:donation': (data: any) => void

	'bond:created': (bond: IBond) => void
	'bond:updated': (bond: IBond) => void
	'bond:deleted': (bondId: string) => void
	'bond:error': (message: string) => void
}

export interface ClientToServerEvents {
	'chat:message': (message: string) => void

    'bond:create': (data: { responder: string }) => void
    'bond:update': (data: { bondId: string; status: { confirmed?: boolean; declined?: boolean; cancelled?: boolean } }) => void
    'bond:delete': (data: { bondId: string }) => void
}
