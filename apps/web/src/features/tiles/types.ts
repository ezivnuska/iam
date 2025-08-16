// apps/web/src/features/tiles/types.ts

export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
    NONE = 'none',
}

export type TileType = {
    id: number
    col: number
    row: number
    direction: Direction
}

export enum GameStatus {
    IDLE = 'idle',
    START = 'start',
    PLAYING = 'playing',
    PAUSED = 'paused',
    RESOLVED = 'resolved',
}

export type EmptyPosition = {
    col: number
    row: number
}