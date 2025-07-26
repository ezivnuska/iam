// apps/web/src/app/lib/socket.ts

import { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@iam/types'

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>
