// apps/web/src/features/memory/MemoryProvider.tsx

import React, { createContext, useState } from 'react'
import * as memoryService from '@iam/services'
import { Memory } from '@iam/types'
import { getErrorMessage } from '@shared/utils'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Column, Row } from '@shared/grid'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MemoryForm } from './components'
import { withAlpha } from '@iam/theme'
import { useTheme, useModal } from '@shared/hooks'
import { DefaultModal } from '@shared/modals/DefaultModal'
import { ModalContainer } from '@shared/modals'

export type MemoryContextType = {
    // memory?: Memory
	error: string | null
	isRefreshing: boolean
	isMutating: boolean
	isInitialized: boolean
	memories: Memory[]
	addMemory: (memory: Memory) => Promise<void>
	deleteMemory: (id: string) => Promise<void>
	deleteMemoryImage: (id: string) => Promise<void>
    // hideMemoryModal: () => void,
	refreshMemories: () => Promise<void>
    // showMemoryModal: (memory: Memory | undefined) => void
	updateMemory: (memory: Memory) => Promise<void>
    // editMemory: (memory: Memory) => void
}

export const MemoryContext = createContext<MemoryContextType>({
    // memory: undefined,
    error: null,
	isRefreshing: false,
	isMutating: false,
	isInitialized: false,
	memories: [],
	addMemory: async (memory: Memory) => {},
	deleteMemory: async (id: string) => {},
	deleteMemoryImage: async (id: string) => {},
    // hideMemoryModal: () => {},
	refreshMemories: async () => {},
    // showMemoryModal: (memory: Memory | undefined) => {},
	updateMemory: async (memory: Memory) => {},
    // editMemory: () => {},
})

type MemoryProviderProps = {
    children: React.ReactNode
}

export const MemoryProvider = ({
    children
}: MemoryProviderProps) => {
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

    // const { theme } = useTheme()
    const { hideModal, showModal } = useModal()
    
    // const [memory, setMemory] = useState<Memory | undefined>()
    // const [modalVisible, setModalVisible] = useState(false)
    // const useNativeModal = Platform.OS !== 'web'

	const refreshMemories = async () => {

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

	const addMemory = async (memory: Memory) => {
        console.log('adding', memory)
		setState(prev => ({ ...prev, memories: [memory, ...prev.memories] }))
        hideModal()
	}

    // const showMemoryModal = (memory: Memory | undefined) => {
    //     showModal((
    //         <ModalContainer
    //             title='Add or Update Memory'
    //             onDismiss={hideModal}
    //         >
    //             <MemoryForm memory={memory} />
    //         </ModalContainer>
    //     ), true)
    //     // setModalVisible(true)
    // }

    // const editMemory = (memory: Memory) => {
    //     // setMemory(memory)
    //     // setModalVisible(true)
    //     // showMemoryModal(memory)
    // }

    // const hideMemoryModal = () => {
    //     // if (memory) setMemory(undefined)
    //     setModalVisible(false)
    // }

	const updateMemory = async (memory: Memory) => {
		setState(prev => ({
            ...prev,
            memories: state.memories.map(m => m.id === memory.id ? memory : m)
        }))
        hideModal()
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
			memories: prev.memories.map(memory => memory.id === id ? { ...memory, image: undefined, imageId: null } : memory),
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

    // const renderModal = () => {
    //     return (
    //         <DefaultModal
    //             title='Add or Update Memory'
    //             onDismiss={() => setModalVisible(false)}
    //         >
    //             <MemoryForm memory={memory} />
    //         </DefaultModal>
    //     )
    // }

	return (
		<MemoryContext.Provider
			value={{
                // memory,
				error: state.error,
				isRefreshing: state.isRefreshing,
				isMutating: state.isMutating,
				isInitialized: state.isInitialized,
				memories: state.memories,
				addMemory,
				deleteMemory,
				deleteMemoryImage,
                // hideMemoryModal,
				refreshMemories,
                // showMemoryModal,
				updateMemory,
                // editMemory,
			}}
		>
            {children}
		</MemoryContext.Provider>
	)
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'box-none',
    },
    content: {
		flex: 1,
		width: '90%',
		maxWidth: 400,
		minWidth: 300,
        alignSelf: 'center',
	},
    header: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
	},
    scrollContent: {
		flexGrow: 1,
        paddingTop: 6,
        paddingBottom: 24,
	},
})
