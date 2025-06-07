// apps/web/src/components/forms/AddCommentForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { TextInput, Text, Alert, TextInput as RNTextInput } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormLayout, FormHeader, SubmitButton } from '@/components'
import { useAuth, useModal, usePosts } from '@/hooks'
import { addComment } from '@services'
import { form as styles, shadows } from '@/styles'

const schema = z.object({
	content: z.string().min(1, 'Comment cannot be empty'),
})

type AddCommentFormProps = z.infer<typeof schema>
type CommentParentType = 'Post' | 'Image'

export const AddCommentForm = ({
	id,
    type,
	onCommentAdded,
    onRefresh,
}: {
	id: string
    type: CommentParentType
	onCommentAdded?: () => void
    onRefresh?: () => void
}) => {
	const { user } = useAuth()
	const { hideModal } = useModal()
	// const { refreshPosts } = usePosts()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		trigger,
		getValues,
	} = useForm<AddCommentFormProps>({
		resolver: zodResolver(schema),
		mode: 'onBlur',
		defaultValues: {
			content: '',
		},
	})

	const [focused, setFocused] = useState<string | null>(null)
	const contentInputRef = useRef<RNTextInput>(null)

	useEffect(() => {
		const validateOnMount = async () => {
			const isValid = await trigger()
			if (!isValid) contentInputRef.current?.focus()
		}
		validateOnMount()
	}, [])

	const onSubmit = async (data: AddCommentFormProps) => {
		if (!user?.id) {
			Alert.alert('Error', 'User ID is missing')
			return
		}

		try {
			await addComment(id, type, data.content)
			onCommentAdded?.()
			if (onRefresh) onRefresh()
			hideModal()
		} catch (err: any) {
			Alert.alert(`Failed to add comment to ${type}`, err?.message || 'Unknown error')
		}
	}

	const isFocused = (name: string) => name === focused

	return (
		<FormLayout>
			<FormHeader title='Add Comment' onCancel={hideModal} />
			<Controller
				control={control}
				name='content'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={contentInputRef}
						placeholder='Add Comment...'
						placeholderTextColor='#070'
						value={value}
						onChangeText={onChange}
						onFocus={() => setFocused('content')}
						onBlur={() => {
							onBlur()
							setFocused(null)
						}}
						autoCapitalize='sentences'
						returnKeyType='done'
						onSubmitEditing={handleSubmit(onSubmit)}
						style={[
							styles.input,
							styles.textArea,
							shadows.input,
							isFocused('content') && styles.inputFocused,
						]}
						multiline
					/>
				)}
			/>
			{errors.content && <Text style={styles.error}>{errors.content.message}</Text>}

			<SubmitButton
				label='Submit'
				onPress={handleSubmit(onSubmit)}
				disabled={isSubmitting}
			/>
		</FormLayout>
	)
}
