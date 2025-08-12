// apps/web/src/features/tiles/TileProvider.tsx

import React, {
    createContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
    ReactNode,
} from 'react'
import type { TileType } from './types'

// ------------------ Types ------------------

export type TileState = {
    data: unknown
    level: number
    ticks: number
    tiles: TileType[]
}

export type TileAction =
    | { type: 'TICK' }
    | { type: 'SET_TILES'; payload: TileType[] }
    | { type: 'RESET_TICKS' }
  
export type TileContextValue = TileState & {
    setTiles: (tiles: TileType[]) => void
    startTicker: () => void
    stopTicker: () => void
    tick: () => void
    resetTicks: () => void
    ticking: boolean
}

// ------------------ Initial State ------------------

const initialState: TileState = {
    data: null,
    level: 4,
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
  
    const setTiles = (payload: TileType[]) => {
        dispatch({ type: 'SET_TILES', payload })
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
  
    const actions = useMemo(
        () => ({
            setTiles,
            tick,
            startTicker,
            stopTicker,
            resetTicks,
        }),
        []
    )
  
    return (
        <TileContext.Provider
            value={{
                ...state,
                ...actions,
                ticking,
            }}
        >
            {children}
      </TileContext.Provider>
    )
}

