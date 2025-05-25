// apps/web/src/components/forms/CreatePostForm.tsx

import React, { useRef, useState } from 'react'
import {
	Text,
	TextInput,
	ActivityIndicator,
	Alert,
	TextInput as RNTextInput,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, FormLayout, FormHeader } from '@/components'
import * as postService from '@services'
import { useModal, usePosts } from '@/hooks'
import { form as styles, shadows } from '@/styles'

const schema = z.object({
	content: z
		.string()
		.min(1, 'Post content is required')
		.max(280, 'Post must be under 280 characters'),
})

type CreatePostFormProps = z.infer<typeof schema>

export const CreatePostForm = ({ onPostCreated }: { onPostCreated?: () => void }) => {
    const { hideModal } = useModal()
    const { addPost } = usePosts()
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		setValue,
		getValues,
	} = useForm<CreatePostFormProps>({
		resolver: zodResolver(schema),
		mode: 'onBlur',
		defaultValues: {
			content: '',
		},
	})

	const [focused, setFocused] = useState<string | null>(null)
	const contentInputRef = useRef<RNTextInput>(null)

	const onSubmit = async (data: CreatePostFormProps) => {
		try {
			const newPost = await postService.createPost(data.content)
			onPostCreated?.()
			setValue('content', '')
            addPost(newPost)
            hideModal()
		} catch (err: any) {
			const message = err?.response?.data?.message || 'Something went wrong'
			setError('content', { message })
			Alert.alert('Post failed', message)
		}
	}

	const focusFirstEmptyField = () => {
		if (!getValues().content.length) {
			contentInputRef.current?.focus()
		}
	}

	const onInvalid = () => {
		focusFirstEmptyField()
	}

	const isFocused = (name: string) => focused === name

	return (
		<FormLayout>
			<FormHeader title='Create Post' onCancel={hideModal} />

			<Controller
				control={control}
				name='content'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={contentInputRef}
						placeholder={`What's on your mind?`}
						placeholderTextColor='#070'
						value={value}
						multiline
						numberOfLines={3}
						onChangeText={onChange}
						onFocus={() => setFocused('content')}
						onBlur={() => {
							onBlur()
							setFocused(null)
						}}
						returnKeyType='done'
						onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
						style={[
							styles.input,
							shadows.input,
							isFocused('content') && styles.inputFocused,
						]}
					/>
				)}
			/>
			{errors.content && <Text style={styles.error}>{errors.content.message}</Text>}

			{isSubmitting ? (
				<ActivityIndicator style={{ marginTop: 20 }} />
			) : (
				<Button label='Post' onPress={handleSubmit(onSubmit, onInvalid)} />
			)}
		</FormLayout>
	)
}
