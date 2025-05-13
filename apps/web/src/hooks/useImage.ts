// apps/web/src/hooks/useImage.ts

import { useContext } from 'react'
import { ImageContext, ImageContextType } from '../providers'

export const useImage = (): ImageContextType => {
    const context = useContext(ImageContext)
    if (!context) throw new Error('useImage must be used within an ImageProvider')
    return context
}