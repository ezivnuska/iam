// apps/web/src/shared/feedback/CommentForm.tsx

import React, { useRef } from 'react'
import { Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Row } from '@shared/grid'
import { ControlledTextInput } from '@shared/forms'
import { addComment } from '@iam/services'
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Size } from '@iam/theme'
import Feather from '@expo/vector-icons/Feather'
import type { Comment, CommentRefType } from '@iam/types'

const schema = z.object({
	content: z.string().min(1).max(140),
})

type CommentFormProps = z.infer<typeof schema>

type Props = {
    id: string
    type: CommentRefType
	onComment: (comment: Comment) => void
}

export const CommentForm = ({ id, type, onComment }: Props) => {

    const inputRef = useRef<TextInput>(null)

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isSubmitting },
        setError,
        setValue,
    } = useForm<CommentFormProps>({
        resolver: zodResolver(schema),
        mode: 'all',
        defaultValues: { content: '' },
    })

    const inputValue = watch('content') || ''

	const onSubmit = async (data: CommentFormProps) => {
		if (!data?.content) {
			Alert.alert('Error', 'Comment data missing')
			return
		}

		try {
            const newComment = await addComment(id, type, data.content)
            onComment(newComment)
            setValue('content', '')
            inputRef.current?.focus()
		} catch (err: unknown) {
			const errorObj = err as {
				response?: { data?: { error?: { details?: unknown } } }
			}
			const details = errorObj.response?.data?.error?.details

			if (Array.isArray(details) && details.length === 2) {
				const [field, issue] = details
				if (typeof field === 'string' && typeof issue === 'string') {
					setError(field as keyof CommentFormProps, { message: issue }, { shouldFocus: true })
				}
			}
		}
	}

    const onInvalid = (errors: FieldErrors<CommentFormProps>) => {
        if (errors.content) {
            inputRef.current?.focus()
        }
    }

	return (
        <Row spacing={Size.S} align='center'>
			<ControlledTextInput
				name='content'
				control={control}
				error={errors.content}
				autoFocus
				placeholder='Say something...'
				inputRef={inputRef}
				onSubmitEditing={handleSubmit(onSubmit)}
				returnKeyType='send'
			/>

			{isDirty ? (
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    style={[
                        styles.button,
                        styles.send,
                        errors.content && styles.disabled,
                    ]}
                >
                    <Feather name='arrow-right' size={30} color={inputValue.trim() ? '#fff' : '#000'} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={() => setValue('content', '')}
                    disabled={isSubmitting}
                    style={[
                        styles.button,
                        styles.cancel,
                        isSubmitting && styles.disabled,
                    ]}
                >
                    <Feather name='x' size={30} color={inputValue.trim() ? '#fff' : '#000'} />
                </TouchableOpacity>
            )}
		</Row>
	)
}

const styles = StyleSheet.create({
	button: {
		borderWidth: 1,
		outlineWidth: 1,
		outlineColor: '#fff',
		height: 40,
		width: 40,
		borderRadius: 20,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	send: {
		backgroundColor: '#3a3',
	},
    cancel: {
		backgroundColor: '#c66',
	},
	disabled: {
		backgroundColor: '#666',
        cursor: 'pointer',
	},
})