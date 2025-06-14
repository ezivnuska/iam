// packages/types/src/socket.ts

export type ChatMessage = {
	id: string
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
