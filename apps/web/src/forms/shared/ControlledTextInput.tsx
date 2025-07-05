// apps/web/src/forms/shared/ControlledTextInput.tsx

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import {
	TextInput,
	Text,
	View,
	TextInputProps,
	NativeSyntheticEvent,
	TextInputContentSizeChangeEventData,
	Platform,
	StyleSheet,
} from 'react-native'
import { Controller, FieldError, Control, FieldPath, FieldValues } from 'react-hook-form'

type Props<T extends FieldValues> = {
	name: FieldPath<T>
	control: Control<T>
	error?: FieldError
	label?: string
	maxHeight?: number
    inputRef?: React.RefObject<TextInput | null>
} & TextInputProps

export const ControlledTextInput = <T extends FieldValues>({
	name,
	control,
	error,
	label,
	maxHeight = 120,
	style,
	...rest
}: Props<T>) => {
	const inputRef = useRef<TextInput>(null)
	const [height, setHeight] = useState(40)
	const [isFocused, setIsFocused] = useState(false)

	useImperativeHandle(rest.inputRef, () => inputRef.current as TextInput)

	const onContentSizeChange = (
		e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
	) => {
		const contentHeight = e.nativeEvent.contentSize.height
		setHeight(Math.min(contentHeight, maxHeight))
	}

	return (
		<View style={{ flex: 1 }}>
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
                            styles.input,
                            { height, textAlignVertical: 'top' },
							isFocused && styles.inputFocused,
                            // error && styles.errorInput,
                            style,
                        ]}
                        placeholderTextColor='#999'
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
