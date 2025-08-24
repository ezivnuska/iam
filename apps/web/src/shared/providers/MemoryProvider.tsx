// apps/web/src/shared/providers/MemoryProvider.tsx

import React, { createContext, useState } from 'react'
import * as memoryService from '@iam/services'
import { Memory } from '@iam/types'
import { getErrorMessage } from '@shared/utils'

export type MemoryContextType = {
	error: string | null
	isRefreshing: boolean
	isMutating: boolean
	isInitialized: boolean
	memories: Memory[]
	addMemory: (memory: Memory) => void
	updateMemory: (memory: Memory) => void
	deleteMemory: (id: string) => Promise<void>
	deleteMemoryImage: (id: string) => Promise<void>
	refreshMemories: () => Promise<void>
}

export const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export const MemoryProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, setState] = useState<{
		memories: Memory[]
		isRefreshing: boolean
		isMutating: boolean
		isInitialized: boolean
		error: string | null
	}>({
		memories: [],
		isRefreshing: false,
		isMutating: false,
		isInitialized: false,
		error: null,
	})

	const refreshMemories = async () => {
		const isInitial = !state.isInitialized

		setState(prev => ({
			...prev,
			isRefreshing: true,
			error: null,
		}))

		try {
			const data = await memoryService.getAllMemories()
			setState(prev => ({
				...prev,
				memories: data,
				isInitialized: true,
			}))
		} catch (err) {
			setState(prev => ({
				...prev,
				error: getErrorMessage(err),
			}))
		} finally {
			setState(prev => ({
				...prev,
				isRefreshing: false,
			}))
		}
	}

	const addMemory = (memory: Memory) => {
		setState(prev => ({ ...prev, memories: [memory, ...prev.memories] }))
	}

	const updateMemory = (memory: Memory) => {
		setState({
            ...state,
            memories: state.memories.map(m => m.id === memory.id ? memory : m)
        })
	}

	const deleteMemory = async (id: string) => {
		const previousMemories = state.memories
		setState(prev => ({
			...prev,
			isMutating: true,
			memories: prev.memories.filter(memory => memory.id !== id),
		}))

		try {
			await memoryService.deleteMemory(id)
		} catch (err) {
			setState(prev => ({
				...prev,
				error: getErrorMessage(err),
				memories: previousMemories,
			}))
		} finally {
			setState(prev => ({
				...prev,
				isMutating: false,
			}))
		}
	}

    const deleteMemoryImage = async (id: string) => {
		const previousMemories = state.memories
		setState(prev => ({
			...prev,
			isMutating: true,
			memories: prev.memories.map(memory => memory.id === id ? { ...memory, imageId: null } : memory),
		}))

		try {
			await memoryService.deleteMemoryImage(id)
		} catch (err) {
			setState(prev => ({
				...prev,
				error: getErrorMessage(err),
				memories: previousMemories,
			}))
		} finally {
			setState(prev => ({
				...prev,
				isMutating: false,
			}))
		}
	}

	return (
		<MemoryContext.Provider
			value={{
				error: state.error,
				isRefreshing: state.isRefreshing,
				isMutating: state.isMutating,
				isInitialized: state.isInitialized,
				memories: state.memories,
				addMemory,
				updateMemory,
				deleteMemory,
				deleteMemoryImage,
				refreshMemories,
			}}
		>
			{children}
		</MemoryContext.Provider>
	)
}
