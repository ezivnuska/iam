// apps/web/src/components/FormField.tsx

import React, { useState } from 'react'
import {
	Control,
	Controller,
	FieldPath,
	FieldValues,
	FieldError,
} from 'react-hook-form'
import { TextInput as RNTextInput, Text, View, TouchableOpacity } from 'react-native'
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
	onFocus,
	onBlur,
}: FormFieldProps<T>) => {
	const [isSecure, setIsSecure] = useState(secure)

	return (
		<View style={{ marginBottom: 0 }}>
			{label && (
				<Text style={styles.label}>
					{label}
				</Text>
			)}
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur: rhfBlur, value, ref } }) => (
					<View style={{ position: 'relative' }}>
						<RNTextInput
							ref={ref}
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
							returnKeyType='next'
							style={[
								styles.input,
								shadows.input,
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
								{isSecure ? (
									<Ionicons name='eye-off' size={20} color='#fff' />
								) : (
									<Ionicons name='eye' size={20} color='#fff' />
								)}
							</TouchableOpacity>
						)}
					</View>
				)}
			/>
			
			<Text style={styles.error}>
				{error?.message ?? ' '}
			</Text>
		</View>
	)
}
