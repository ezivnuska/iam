// apps/web/src/features/feed/hooks/usePosts.ts

import { useContext } from 'react'
import { MemoryContext, MemoryContextType } from '..'

export const useMemory = (): MemoryContextType => {
	const context = useContext(MemoryContext)
	if (!context) {
		throw new Error('useMemory must be used within a MemoryProvider')
	}
	return context
}