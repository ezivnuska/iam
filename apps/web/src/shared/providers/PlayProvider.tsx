// apps/web/src/shared/providers/PlayContext.tsx

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
    ReactNode,
  } from 'react'
  
  // ------------------ Types ------------------
  
  export type PlayModal = {
    type: string
    data: unknown
  }
  
  export type TileType = {
    id: string
    col: number
    row: number
    direction: string
    dragging: boolean
  }
  
  export type PlayState = {
    modals: PlayModal[]
    data: unknown
    level: number
    ticks: number
    tiles: TileType[]
  }
  
  export type PlayAction =
    | { type: 'TICK' }
    | { type: 'SET_TILES'; payload: TileType[] }
    | { type: 'RESET_TICKS' }
    | { type: 'SET_PLAY_MODAL'; payload: PlayModal }
    | { type: 'CLOSE_PLAY_MODAL' }
  
  export type PlayContextValue = PlayState & {
    closePlayModal: () => void
    setPlayModal: (type: string, data: unknown) => void
    setTiles: (tiles: TileType[]) => void
    startTicker: () => void
    stopTicker: () => void
    tick: () => void
    resetTicks: () => void
    ticking: boolean
    getTile: (id: string) => TileType | undefined
    playModal?: PlayModal
  }
  
  // ------------------ Initial State ------------------
  
  const initialState: PlayState = {
    modals: [],
    data: null,
    level: 4,
    ticks: 0,
    tiles: [],
  }
  
  // Create Context with a partial type (we’ll cast it in the provider)
  export const PlayContext = createContext<PlayContextValue>({} as PlayContextValue)
  
  // ------------------ Reducer ------------------
  
  const reducer = (state: PlayState, action: PlayAction): PlayState => {
    switch (action.type) {
      case 'TICK':
        return { ...state, ticks: state.ticks + 1 }
      case 'SET_TILES':
        return { ...state, tiles: action.payload }
      case 'RESET_TICKS':
        return { ...state, ticks: 0 }
      case 'SET_PLAY_MODAL':
        return { ...state, modals: [...state.modals, action.payload] }
      case 'CLOSE_PLAY_MODAL':
        return { ...state, modals: state.modals.slice(0, state.modals.length - 1) }
      default:
        throw new Error(`Unhandled action type: ${(action as any).type}`)
    }
  }
  
  // ------------------ Provider ------------------
  
  type PlayProviderProps = {
    children: ReactNode
  }
  
  export const PlayProvider: React.FC<PlayProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [ticker, setTicker] = useState<NodeJS.Timeout | null>(null)
  
    const tick = () => dispatch({ type: 'TICK' })
  
    const setTiles = (payload: TileType[]) => {
      dispatch({ type: 'SET_TILES', payload })
    }
  
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
  
    const getTile = (id: string): TileType | undefined => {
      return state.tiles.find((t) => t.id === id)
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
        setPlayModal: (type: string, data: unknown) => {
          dispatch({ type: 'SET_PLAY_MODAL', payload: { data, type } })
        },
        closePlayModal: () => {
          dispatch({ type: 'CLOSE_PLAY_MODAL' })
        },
      }),
      []
    )
  
    return (
      <PlayContext.Provider
        value={{
          ...state,
          ...actions,
          playModal: state.modals[state.modals.length - 1],
          ticking,
          getTile,
        }}
      >
        {children}
      </PlayContext.Provider>
    )
  }
  
  // ------------------ Hook ------------------
  
//   export const usePlay = (): PlayContextValue => {
//     const context = useContext(PlayContext)
//     if (!context) {
//       throw new Error('usePlay must be used within a PlayProvider')
//     }
//     return context
//   }
  