// apps/web/src/shared/buttons/CreateMemoryButton.tsx

import React from 'react'
import { useModal } from'@shared/hooks'
import { useMemory } from'@features/memory'
import { Button } from '@shared/buttons'
import { MemoryForm } from '@shared/forms'
import type { Memory } from '@iam/types'

export const CreateMemoryButton = () => {
	const { hideModal, openFormModal } = useModal()
	const { addMemory } = useMemory()

	const onMemoryCreated = (memory: Memory) => {
		addMemory(memory)
		hideModal()
	}

	const showMemoryModal = () => {
		openFormModal(MemoryForm, { onComplete: onMemoryCreated }, { title: 'Create Memory', fullscreen: true })
	}

	return (
        <Button
            label='New Memory'
            onPress={showMemoryModal}
            variant='primary'
            compact
        />
    )
}
