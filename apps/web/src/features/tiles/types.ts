// apps/web/src/features/tiles/types.ts

export type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

export type TileType = {
  id: number
  col: number
  row: number
  direction?: Direction
  dragging?: boolean
}

export type GameStatus = 'idle' | 'start' | 'playing' | 'paused' | 'resolved'
