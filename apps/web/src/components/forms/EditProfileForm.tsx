// apps/web/src/components/forms/EditProfileForm.tsx

import React from 'react'
import { Alert } from 'react-native'
import { useAuth, useModal } from '@/hooks'
import { updateSelf } from '@services'
import type { Path, UseFormSetError } from 'react-hook-form'
import { DynamicForm, bioFields, bioSchema } from '@/components'
import type { BioFormValues } from '@/components'

export const EditProfileForm = () => {
	const { user, setUser } = useAuth()
	const { hideModal } = useModal()

	const handleSubmit = async (
		data: BioFormValues,
		setError: UseFormSetError<BioFormValues>
	) => {
		if (!user?.id) {
			Alert.alert('Error', 'User ID is missing')
			return
		}

		try {
			const updated = await updateSelf(data)
			setUser(updated)
			hideModal()
		} catch (err: any) {
			const message = err?.message || 'Unknown error'
			setError('bio' as Path<BioFormValues>, { message })
			Alert.alert('Update failed', message)
		}
	}

	return (
        <DynamicForm
            schema={bioSchema}
            fields={bioFields}
            onSubmit={handleSubmit}
            submitLabel='Update Bio'
            defaultValues={{ bio: user?.bio ?? '' }}
        />
	)
}
