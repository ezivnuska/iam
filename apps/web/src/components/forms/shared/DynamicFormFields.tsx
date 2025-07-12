// apps/web/src/components/forms/shared/DynamicFormFields.tsx

import React from 'react'
import { TextInput } from 'react-native'
import { Control, FieldValues, Path } from 'react-hook-form'
import { Column, FormField } from '@/components'
import type { FieldConfig } from '@/types'

type DynamicFormFieldsProps<T extends FieldValues> = {
	fields: FieldConfig<T>[]
	control: Control<T>
	errors: Partial<Record<keyof T, any>>
	inputRefs: React.RefObject<Record<string, React.RefObject<TextInput | null>>>
	formValues: Partial<T>
	triggerField: (name: keyof T) => Promise<boolean>
	handleSubmit: () => void
}

export function DynamicFormFields<T extends FieldValues>({
	fields,
	control,
	errors,
	inputRefs,
	formValues,
	triggerField,
	handleSubmit,
}: DynamicFormFieldsProps<T>) {
	return (
		<Column spacing={12}>
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
		</Column>
	)
}
