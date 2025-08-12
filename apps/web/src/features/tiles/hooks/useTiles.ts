// apps/web/src/features/tiles/hooks/useTiles.ts

import { useContext } from 'react'
import { TileContext, type TileContextValue } from '../'

export const useTiles = (): TileContextValue => {
    const context = useContext(TileContext)
    if (!context) {
        throw new Error('useTiles must be used within a TileProvider')
    }
    return context
}