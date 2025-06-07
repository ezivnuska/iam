// apps/web/src/components/forms/AddCommentForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { TextInput, Text, Alert, TextInput as RNTextInput } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	FormLayout,
	FormHeader,
	SubmitButton,
} from '@/components'
import { useAuth, useModal } from '@/hooks'
import { addComment } from '@services'
import { form as styles, shadows } from '@/styles'

const schema = z.object({
	content: z.string().min(1, 'Comment cannot be empty'),
})

type FormData = z.infer<typeof schema>
type CommentParentType = 'Post' | 'Image'

type AddCommentFormProps = {
	id: string
	type: CommentParentType
	onCommentAdded?: (newComment: Comment) => void
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({
	id,
	type,
	onCommentAdded,
}) => {
	const { user } = useAuth()
	const { hideModal } = useModal()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		trigger,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: 'onBlur',
		defaultValues: { content: '' },
	})

	const [focusedField, setFocusedField] = useState<string | null>(null)
	const contentRef = useRef<RNTextInput>(null)

	useEffect(() => {
		trigger().then((isValid) => {
			if (!isValid) contentRef.current?.focus()
		})
	}, [])

	const onSubmit = async ({ content }: FormData) => {
		if (!user?.id) {
			Alert.alert('Error', 'User ID is missing')
			return
		}

		try {
			const newComment = await addComment(id, type, content)
			onCommentAdded?.(newComment)
			hideModal()
		} catch (err: any) {
			Alert.alert(`Failed to add comment to ${type}`, err?.message || 'Unknown error')
		}
	}

	return (
		<FormLayout>
			<FormHeader title="Add Comment" onCancel={hideModal} />

			<Controller
				control={control}
				name="content"
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={contentRef}
						placeholder="Add Comment..."
						placeholderTextColor="#070"
						value={value}
						onChangeText={onChange}
						onFocus={() => setFocusedField('content')}
						onBlur={() => {
							onBlur()
							setFocusedField(null)
						}}
						autoCapitalize="sentences"
						returnKeyType="done"
						onSubmitEditing={handleSubmit(onSubmit)}
						style={[
							styles.input,
							styles.textArea,
							shadows.input,
							focusedField === 'content' && styles.inputFocused,
						]}
						multiline
					/>
				)}
			/>

			{errors.content && (
				<Text style={styles.error}>{errors.content.message}</Text>
			)}

			<SubmitButton
				label="Submit"
				onPress={handleSubmit(onSubmit)}
				disabled={isSubmitting}
			/>
		</FormLayout>
	)
}
