// apps/web/src/shared/hooks/usePlay.ts

import { useContext } from 'react'
import { PlayContext, PlayContextValue } from '@shared/providers'
  
export const usePlay = (): PlayContextValue => {
    const context = useContext(PlayContext)
    if (!context) {
      throw new Error('usePlay must be used within a PlayContextProvider')
    }
    return context
}