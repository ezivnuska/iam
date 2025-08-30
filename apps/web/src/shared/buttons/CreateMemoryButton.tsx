// apps/web/src/shared/buttons/CreateMemoryButton.tsx

import React from 'react'
import { MemoryForm, useMemory } from'@features/memory'
import { Button } from '@shared/buttons'
import { useModal } from '@shared/hooks'
import { ModalContainer } from '@shared/modals'

export const CreateMemoryButton = () => {
	const { hideModal, showModal } = useModal()

    const showMemoryModal = () => {
        showModal((
            <ModalContainer
                title='Add or Update Memory'
                onDismiss={hideModal}
            >
                <MemoryForm />
            </ModalContainer>
        ), true)
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
