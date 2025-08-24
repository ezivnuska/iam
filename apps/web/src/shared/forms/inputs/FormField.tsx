// apps/web/src/shared/forms/inputs/FormField.tsx

import React, { useState } from 'react'
import {
	Control,
	Controller,
	FieldPath,
	FieldValues,
	FieldError,
} from 'react-hook-form'
import {
	TextInput as RNTextInput,
	Text,
	View,
	TouchableOpacity,
	TextInput,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { form as styles } from '@iam/theme'
import { useTheme } from '@shared/hooks'
import { Row } from '@shared/grid'

type FormFieldProps<T extends FieldValues> = {
	name: FieldPath<T>
	control: Control<T>
	error?: FieldError
	label?: string
	placeholder?: string
	secure?: boolean
	autoFocus?: boolean
	inputRef?: React.RefObject<TextInput | null>
	keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType']
	onSubmitEditing?: () => void
	onFocus?: () => void
	onBlur?: () => void
}

export const FormField = <T extends FieldValues>({
	name,
	control,
	error,
	label,
	placeholder,
	secure = false,
	autoFocus = false,
	inputRef,
	onSubmitEditing,
	onFocus,
	onBlur,
	keyboardType = 'default',
}: FormFieldProps<T>) => {
    const { theme } = useTheme()
	const [isSecure, setIsSecure] = useState(secure)
    const [isFocused, setIsFocused] = useState(false)
	return (
		<View style={{ marginBottom: 0 }}>
			{label && <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>}

			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur: rhfBlur, value } }) => (
					<Row align='center' style={{ position: 'relative' }}>
						<RNTextInput
							ref={inputRef}
							value={value ?? ''}
							onChangeText={onChange}
							onFocus={() => {
                                setIsFocused(true)
                                onFocus?.()
                            }}
							onBlur={() => {
                                setIsFocused(false)
								rhfBlur()
								onBlur?.()
							}}
							autoFocus={autoFocus}
							placeholder={placeholder ?? label ?? name}
							placeholderTextColor={isFocused ? theme.colors.formField.placeholderFocused : theme.colors.muted}
							autoCapitalize='none'
							secureTextEntry={isSecure}
							returnKeyType='done'
							onSubmitEditing={onSubmitEditing}
							keyboardType={keyboardType}
							style={[
								styles.input,
								error && { borderColor: 'red' },
                                isFocused && styles.inputFocused,
							]}
						/>

						{secure && (
							<TouchableOpacity
								onPress={() => setIsSecure((prev) => !prev)}
								style={{
									position: 'absolute',
									right: 12,
									top: 14,
									zIndex: 1,
								}}
							>
								<Ionicons
									name={isSecure ? 'eye-off' : 'eye'}
									size={20}
									color={isFocused ? theme.colors.formField.placeholderFocused : theme.colors.muted}
								/>
							</TouchableOpacity>
						)}
					</Row>
				)}
			/>

			<Text style={styles.error}>{error?.message ?? ' '}</Text>
		</View>
	)
}
