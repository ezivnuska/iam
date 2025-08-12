// apps/web/src/features/tiles/TileProvider.tsx

import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
    ReactNode,
} from 'react'
import { GameStatus, TileType } from './types'
import type { EmptyPosition } from './types'

// ------------------ Types ------------------

export type TileState = {
    data: unknown
    level: number
    status: GameStatus
    ticks: number
    tiles: TileType[]
    time?: string
}

export type TileAction =
    | { type: 'TICK' }
    | { type: 'SET_STATUS'; payload: GameStatus }
    | { type: 'SET_TILES'; payload: TileType[] }
    | { type: 'RESET_TICKS' }
  
export type TileContextValue = TileState & {
    ticking: boolean
    time?: string
    emptySpace?: EmptyPosition
    setStatus: (status: GameStatus) => void
    setTiles: (tiles: TileType[]) => void
    startTicker: () => void
    stopTicker: () => void
    tick: () => void
    resetTicks: () => void
}

// ------------------ Initial State ------------------

const initialState: TileState = {
    data: null,
    level: 4,
    status: GameStatus.IDLE,
    ticks: 0,
    tiles: [],
}

// Create Context with a partial type (we’ll cast it in the provider)
export const TileContext = createContext<TileContextValue>({} as TileContextValue)

// ------------------ Reducer ------------------

const reducer = (state: TileState, action: TileAction): TileState => {

    switch (action.type) {
        case 'TICK':
            return { ...state, ticks: state.ticks + 1 }
        case 'SET_STATUS':
            return { ...state, status: action.payload }
        case 'SET_TILES':
            return { ...state, tiles: action.payload }
        case 'RESET_TICKS':
            return { ...state, ticks: 0 }
        default:
            throw new Error(`Unhandled action type: ${(action as any).type}`)
    }
}

// ------------------ Provider ------------------

type TileProviderProps = {
    children: ReactNode
}

export const TileProvider: React.FC<TileProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [ticker, setTicker] = useState<NodeJS.Timeout | null>(null)

    const formattedTime = useMemo(() => {
        if (state.ticks <= 0) return
        const m = Math.floor(state.ticks / 60)
        const s = state.ticks < 60 ? state.ticks : state.ticks % 60
        return `${m > 0 ? (m < 10 ? `0${m}` : `${m}`) : `00`}:${s < 10 ? `0${s}` : s}`
    }, [state.ticks])

    useEffect(() => {
        if (!state.status) return
        switch (state.status) {
            case GameStatus.IDLE:
                resetTicks()
                initTiles()
            break
            case GameStatus.START:
                shuffle()
            break
            case GameStatus.PLAYING:
                startTicker()
            break
            case GameStatus.PAUSED:
            case GameStatus.RESOLVED:
                stopTicker()
            break
        }
    }, [state.status])

    const resolveTiles = useCallback(() => {
        if (!state.tiles?.length) return false
        let numCorrect = 0
        for (let r = 0; r < state.level; r++) {
            for (let c = 0; c < state.level; c++) {
                const tile = state.tiles.find(t => t.col === c && t.row === r)
                if (!tile || tile.id !== numCorrect) {
                    return false
                }
                if (numCorrect === state.tiles.length - 1) return true
                numCorrect++
            }
        }
    }, [state.tiles])

    useEffect(() => {
        if (state.status === GameStatus.PLAYING && resolveTiles()) {
            setStatus(GameStatus.RESOLVED)
        }
    }, [state.tiles])

    // ------------------ EmptySpace ------------------

    const getEmptyRow = useCallback(() => {
        let emptyRow = null
        if (state.tiles) {
            for (let r = 0; r < state.level; r++) {
                const rowTiles = state.tiles.filter(t => t.row === r)
                if (rowTiles.length < state.level) emptyRow = r
            }
        }
        return emptyRow
    }, [state.tiles])

    const getEmptyCol = useCallback(() => {
        let emptyCol = null
        if (state.tiles) {
            for (let c = 0; c < state.level; c++) {
                const colTiles = state.tiles.filter(t => t.col === c)
                if (colTiles.length < state.level) emptyCol = c
            }
        }
        return emptyCol
    }, [state.tiles])

    const emptySpace = useMemo(() => {
        const col = getEmptyCol()
        const row = getEmptyRow()
        return (col !== null && row !== null) ? { col, row } : undefined
    }, [getEmptyCol, getEmptyRow])

    // ------------------ Tiles ------------------

    const initTiles = () => {
        const initialTiles: TileType[] = []
        let id = 0
        for (let row = 0; row < state.level; row++) {
            for (let col = 0; col < state.level; col++) {
                initialTiles.push({ id, row, col })
                id++
            }
        }

        const lastTile = initialTiles.pop()
        let empty = { col: state.level - 1, row: state.level - 1 }
        if (lastTile) empty = { col: lastTile.col, row: lastTile.row }
        
        setTiles(initialTiles)
    }
  
    const setTiles = (payload: TileType[]) => {
        dispatch({ type: 'SET_TILES', payload })
    }

    const shuffle = () => {
        const pile = [...state.tiles]
        let col = 0
        let row = 0
        const shuffled: TileType[] = []
        while (pile.length > 0) {
            const index = Math.floor(Math.random() * pile.length)
            const tile = pile.splice(index, 1)[0]
            const newTile = { ...tile, col, row }
            shuffled.push(newTile)
            col++
            if (col >= state.level) {
                col = 0
                row++
            }
        }
        
        setTiles(shuffled)
        setStatus(GameStatus.PLAYING)
    }

    const setStatus = (payload: GameStatus) => {
        dispatch({ type: 'SET_STATUS', payload })
    }

    // ------------------ Ticker ------------------
    
    const tick = () => dispatch({ type: 'TICK' })
  
    const startTicker = () => {
        if (!ticker) {
            const interval = setInterval(tick, 1000)
            setTicker(interval)
        }
    }
  
    const stopTicker = () => {
        if (ticker) {
            clearInterval(ticker)
            setTicker(null)
        }
    }
  
    const resetTicks = () => {
        dispatch({ type: 'RESET_TICKS' })
    }
  
    useEffect(() => {
        return () => {
            if (ticker) {
                clearInterval(ticker)
            }
        }
    }, [ticker])
  
    const ticking = useMemo(() => ticker !== null, [ticker])
  
    const actions = useMemo(() => ({
        setStatus,
        setTiles,
        tick,
        startTicker,
        stopTicker,
        resetTicks,
    }), [])
  
    return (
        <TileContext.Provider
            value={{
                ...state,
                ...actions,
                emptySpace,
                ticking,
                time: formattedTime,
            }}
        >
            {children}
      </TileContext.Provider>
    )
}
