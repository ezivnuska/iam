// apps/web/src/shared/feedback/forms/CommentForm.tsx

import React from 'react'
import { Alert } from 'react-native'
import { commentSchema, commentFields } from './'
import { DynamicForm } from '@shared/forms'
import { useModal } from '@shared/hooks'
import { addComment } from '@iam/services'
import type { CommentFormValues } from './'
import type { Comment, CommentRefType } from '@iam/types'

type CommentFormProps = {
	id: string
	type: CommentRefType
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
