// apps/web/src/shared/forms/utils/renderFields.tsx

import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import { FormField } from '../'
import type { Control, FieldValues, Path } from 'react-hook-form'
import type { FieldConfig } from '../'

export function renderFields<T extends FieldValues>(
	fields: FieldConfig<T>[],
	control: Control<T>,
	errors: Partial<Record<keyof T, any>>,
	inputRefs: React.RefObject<Record<string, React.RefObject<TextInput | null>>>,
	formValues: Partial<T>,
	triggerField: (name: keyof T) => Promise<boolean>,
	handleSubmit: () => void
) {
	return (
		<View style={styles.container}>
			{fields.map((field, index) => {
				const name = field.name as keyof T
				const nextField = fields[index + 1]?.name as keyof T | undefined
		
				return (
					<FormField<T>
						key={name as string}
						name={name as Path<T>}
						label={field.label}
						control={control}
						error={errors[name]}
						secure={field.secure}
						autoFocus={field.autoFocus}
						keyboardType={field.keyboardType}
						placeholder={field.placeholder}
						inputRef={inputRefs.current[name as string]}
						onSubmitEditing={async () => {
							const isValid = await triggerField(name)
							if (!isValid) {
								inputRefs.current[name as string]?.current?.focus()
								return
							}
						
							const allValid = fields.every((f) => !errors[f.name])
						
							if (allValid) {
								handleSubmit()
							} else if (nextField) {
								inputRefs.current[nextField as string]?.current?.focus()
							}
						}}						
					/>
				)
			})}
		</View>
	)
}	

const styles = StyleSheet.create({
	container: {
		marginVertical: 12,
	}
})
