// packages/types/src/socket.types.ts

import { ImageDocument, ImageVariant } from './image.types'
import type { Bond, ChatMessage } from '.'

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

export interface ServerToClientEvents {
	'chat:message': (message: ChatMessage) => void
	'kofi:donation': (data: any) => void

	'bond:created': (bond: Bond) => void
	'bond:updated': (bond: Bond) => void
	'bond:deleted': (bondId: string) => void
	'bond:error': (message: string) => void
}

export interface ClientToServerEvents {
	'chat:message': (message: string) => void

    'bond:create': (data: { responder: string }) => void
    'bond:update': (data: { bondId: string; status: { confirmed?: boolean; declined?: boolean; cancelled?: boolean } }) => void
    'bond:delete': (data: { bondId: string }) => void
}
