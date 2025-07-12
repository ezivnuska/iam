// packages/types/src/chat.types.ts

import { PartialUser } from './user.types'

export interface ChatMessage {
    text: string
    timestamp: string
    user: PartialUser
}
