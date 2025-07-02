// apps/web/src/components/forms/CommentForm.tsx

import React from 'react'
import { Alert } from 'react-native'
import { useAuth, useModal } from '@/hooks'
import { addComment } from '@services'
import { commentSchema, commentFields, DynamicForm } from '@/forms'
import type { CommentFormValues } from '@/forms'

type CommentParentType = 'Post' | 'Image'

type CommentFormProps = {
	id: string
	type: CommentParentType
}

export const CommentForm: React.FC<CommentFormProps> = ({
	id,
	type,
}) => {
	const { user } = useAuth()
	const { hideModal } = useModal()

	const handleSubmit = async (values: CommentFormValues) => {
		if (!user?.id) {
			Alert.alert('Error', 'User ID is missing')
			return
		}

		try {
			const newComment = await addComment(id, type, values.content)
			hideModal()
		} catch (err: any) {
			const message = err?.message || 'Unknown error'
			Alert.alert(`Failed to add comment to ${type}`, message)
		}
	}

	return (
		<DynamicForm
			schema={commentSchema}
			fields={commentFields}
			onSubmit={handleSubmit}
			submitLabel='Submit'
			defaultValues={{ content: '' }}
		/>
	)
}
