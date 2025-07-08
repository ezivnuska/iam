// apps/web/src/components/forms/CommentForm.tsx

import React from 'react'
import { Alert } from 'react-native'
import { commentSchema, commentFields, DynamicForm } from '@/components'
import { useModal } from '@/hooks'
import { addComment } from '@services'
import type { CommentFormValues } from '@/components'
import type { Comment } from '@iam/types'

type CommentParentType = 'Post' | 'Image'

type CommentFormProps = {
	id: string
	type: CommentParentType
    onCommentAdded: (comment: Comment) => void
}

export const CommentForm: React.FC<CommentFormProps> = ({
	id,
	type,
    onCommentAdded,
}) => {
	const { hideModal } = useModal()

	const handleSubmit = async (values: CommentFormValues) => {
		try {
			const newComment = await addComment(id, type, values.content)
            onCommentAdded(newComment)
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
