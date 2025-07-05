// apps/web/src/forms/shared/FormTextArea.tsx

import React, { useState, useRef, useEffect } from 'react'
import {
	Control,
	Controller,
	FieldError,
	FieldPath,
	FieldValues,
} from 'react-hook-form'
import {
	Text,
	View,
	TextInput,
	TextInputProps,
	NativeSyntheticEvent,
	TextInputContentSizeChangeEventData,
} from 'react-native'
import { form as styles, shadows } from '@/styles'

type FormTextAreaProps<T extends FieldValues> = {
	name: FieldPath<T>
	control: Control<T>
	error?: FieldError
	label?: string
	placeholder?: string
	autoFocus?: boolean
	inputRef?: React.RefObject<TextInput | null>
	onSubmitEditing?: () => void
	onFocus?: () => void
	onBlur?: () => void
}

export const FormTextArea = <T extends FieldValues>({
	name,
	control,
	error,
	label,
	placeholder,
	autoFocus = false,
	inputRef,
	onSubmitEditing,
	onFocus,
	onBlur,
}: FormTextAreaProps<T>) => {
	const [height, setHeight] = useState(40) // Default height for single line
	const internalRef = useRef<TextInput>(null)

	// Allow parent to access ref
	useEffect(() => {
		if (inputRef && internalRef.current) {
			inputRef.current = internalRef.current
		}
	}, [inputRef])

	const handleContentSizeChange = (
		e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
	) => {
		setHeight(Math.max(40, e.nativeEvent.contentSize.height))
	}

	return (
		<View style={{ marginBottom: 0 }}>
			{label && <Text style={styles.label}>{label}</Text>}

			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur: rhfBlur, value } }) => (
					<TextInput
						ref={internalRef}
						value={value ?? ''}
						onChangeText={onChange}
						onFocus={onFocus}
						onBlur={() => {
							rhfBlur()
							onBlur?.()
						}}
						multiline
						autoFocus={autoFocus}
						placeholder={placeholder ?? label ?? name}
						placeholderTextColor='#070'
						autoCapitalize='none'
						onSubmitEditing={onSubmitEditing}
						onContentSizeChange={handleContentSizeChange}
						style={[
							styles.input,
							shadows.input,
							{
								height,
								textAlignVertical: 'top',
								paddingTop: 10,
								paddingBottom: 10,
							},
							error && { borderColor: 'red' },
						]}
					/>
				)}
			/>

			<Text style={styles.error}>{error?.message ?? ' '}</Text>
		</View>
	)
}
