// apps/web/src/forms/shared/FormField.tsx

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
import { form as styles, shadows } from '@/styles'

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
	const [isSecure, setIsSecure] = useState(secure)

	return (
		<View style={{ marginBottom: 0 }}>
			{label && <Text style={styles.label}>{label}</Text>}

			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur: rhfBlur, value } }) => (
					<View style={{ position: 'relative' }}>
						<RNTextInput
							ref={inputRef}
							value={value ?? ''}
							onChangeText={onChange}
							onFocus={onFocus}
							onBlur={() => {
								rhfBlur()
								onBlur?.()
							}}
							autoFocus={autoFocus}
							placeholder={placeholder ?? label ?? name}
							placeholderTextColor='#070'
							autoCapitalize='none'
							secureTextEntry={isSecure}
							returnKeyType='done'
							onSubmitEditing={onSubmitEditing}
							keyboardType={keyboardType}
							style={[
								styles.input,
								error && { borderColor: 'red' },
							]}
						/>

						{secure && (
							<TouchableOpacity
								onPress={() => setIsSecure((prev) => !prev)}
								style={{
									position: 'absolute',
									right: 12,
									top: 12,
									zIndex: 1,
								}}
							>
								<Ionicons
									name={isSecure ? 'eye-off' : 'eye'}
									size={20}
									color='#fff'
								/>
							</TouchableOpacity>
						)}
					</View>
				)}
			/>

			<Text style={styles.error}>{error?.message ?? ' '}</Text>
		</View>
	)
}
