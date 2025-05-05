// apps/web/src/hooks/useModal.ts

import { useContext } from 'react'
import { ModalContext, ModalContextType } from '../providers'

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext)
    if (!context) throw new Error('useModal must be used within a ModalProvider')
    return context
}