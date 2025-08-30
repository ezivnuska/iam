// apps/web/src/shared/forms/inputs/ControlledTextInput.tsx

import React, { useState } from 'react'
import {
	TextInput,
	Text,
	View,
	TextInputProps,
	NativeSyntheticEvent,
	TextInputContentSizeChangeEventData,
	StyleSheet,
} from 'react-native'
import { Controller, FieldError, Control, FieldPath, FieldValues } from 'react-hook-form'
import { useTheme } from '@shared/hooks'
import { form as formStyles } from '@iam/theme'

type Props<T extends FieldValues> = {
	name: FieldPath<T>
	control: Control<T>
	error?: FieldError
	label?: string
	maxHeight?: number
    inputRef: React.RefObject<TextInput | null>
} & TextInputProps

export const ControlledTextInput = <T extends FieldValues>({
    inputRef,
	name,
	control,
	error,
	label,
	maxHeight = 120,
	style,
	...rest
}: Props<T>) => {
	const [height, setHeight] = useState(40)
	const [isFocused, setIsFocused] = useState(false)
    const { theme } = useTheme()

	const onContentSizeChange = (
		e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
	) => {
		const contentHeight = e.nativeEvent.contentSize.height
		setHeight(Math.min(contentHeight, maxHeight))
	}

	return (
		<View style={{ height }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        ref={inputRef}
                        value={value}
                        onChangeText={onChange}
						{...rest}
						onFocus={(e) => {
							setIsFocused(true)
							rest.onFocus?.(e)
						}}
                        onBlur={(e) => {
							setIsFocused(false)
							onBlur()
							rest.onBlur?.(e)
						}}
                        multiline
                        onContentSizeChange={onContentSizeChange}
                        style={[
                            formStyles.input,
                            { height, textAlignVertical: 'center' },
							isFocused && formStyles.inputFocused,
                            style,
                        ]}
                        placeholderTextColor={theme.colors.muted}
                    />
                )}
            />
            {/* {error && <Text style={styles.errorText}>{error.message}</Text>} */}
		</View>
	)
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		outlineWidth: 0,
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		fontSize: 16,
		lineHeight: 24,
		backgroundColor: '#333',
		color: '#fff',
	},
	inputFocused: {
		backgroundColor: '#fff',
		color: '#000',
	},
	// errorInput: {
	// 	// borderColor: 'red',
	// },
	label: {
		color: '#fff',
		fontWeight: '600',
		marginBottom: 6,
	},
	errorText: {
		color: 'red',
		marginTop: 4,
	},
})
