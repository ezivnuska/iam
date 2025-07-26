// apps/web/src/features/chat/components/ChatInput.tsx

import React, { useRef } from 'react'
import { TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useForm, FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Feather from '@expo/vector-icons/Feather'
import { Row } from '@shared/grid'
import { ControlledTextInput } from '@shared/forms'
import { Size } from '@iam/theme'

const schema = z.object({
	input: z.string().min(1, 'Message is required').max(280),
})

type ChatFormProps = z.infer<typeof schema>

type Props = {
	onSend: (message: string) => void
}

export const ChatInput = ({ onSend }: Props) => {
	const inputRef = useRef<TextInput>(null)

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
		setError,
		setValue,
	} = useForm<ChatFormProps>({
		resolver: zodResolver(schema),
		mode: 'all',
		defaultValues: {
			input: '',
		},
	})

	const inputValue = watch('input') || ''

	const onSubmit = async (data: ChatFormProps) => {
		try {
			onSend(data.input)
			setValue('input', '')
			inputRef.current?.focus()
		} catch (err: unknown) {
			const errorObj = err as {
				response?: { data?: { error?: { details?: unknown } } }
			}
			const details = errorObj.response?.data?.error?.details

			if (Array.isArray(details) && details.length === 2) {
				const [field, issue] = details
				if (typeof field === 'string' && typeof issue === 'string') {
					setError(field as keyof ChatFormProps, { message: issue }, { shouldFocus: true })
				}
			}
		}
	}

	const onInvalid = (errors: FieldErrors<ChatFormProps>) => {
		if (errors.input) {
			inputRef.current?.focus()
		}
	}

	return (
		<Row spacing={Size.S} align='flex-end'>
			<ControlledTextInput
				name='input'
				control={control}
				error={errors.input}
				autoFocus
				placeholder='Say something...'
				inputRef={inputRef}
				onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
				returnKeyType='send'
			/>
			<TouchableOpacity
				onPress={handleSubmit(onSubmit, onInvalid)}
				style={[
					styles.sendButton,
					!inputValue.trim() && styles.disabledButton,
				]}
				disabled={!inputValue.trim()}
			>
				<Feather name='arrow-right' size={30} color={inputValue.trim() ? '#fff' : '#000'} />
			</TouchableOpacity>
		</Row>
	)
}

const styles = StyleSheet.create({
	sendButton: {
		borderWidth: 1,
		outlineWidth: 1,
		outlineColor: '#fff',
		backgroundColor: '#3a3',
		height: 40,
		width: 40,
		borderRadius: 20,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	disabledButton: {
		backgroundColor: '#666'
	},
})
