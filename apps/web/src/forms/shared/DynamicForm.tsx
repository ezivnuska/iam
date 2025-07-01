// apps/web/src/components/forms/DynamicForm.tsx

import React, { useEffect } from 'react'
import { Alert } from 'react-native'
import { useForm, UseFormSetError, Path, PathValue } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z, ZodTypeAny, ZodObject } from 'zod'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { renderFields, SubmitButton } from '@/forms'

type FieldConfig<T extends z.ZodTypeAny> = {
	name: Path<z.infer<T>>
	label: string
	secure?: boolean
	autoFocus?: boolean
}

interface DynamicFormProps<T extends ZodTypeAny> {
	schema: T
	fields: FieldConfig<T>[]
	onSubmit: (
		data: z.infer<T>,
		setError: UseFormSetError<z.infer<T>>
	) => Promise<void>
	submitLabel: string
	prefillEmail?: boolean
	defaultValues?: Partial<z.infer<T>>
}

function isZodObject(schema: z.ZodTypeAny): schema is ZodObject<any> {
	return (schema as any).shape !== undefined
}

export function DynamicForm<T extends ZodTypeAny>({
	schema,
	fields,
	submitLabel,
	prefillEmail = false,
	defaultValues,
	onSubmit,
}: DynamicFormProps<T>) {
	const form = useForm<z.infer<T>>({
		resolver: zodResolver(schema),
		mode: 'all',
		defaultValues: {
			...(Object.fromEntries(
				(isZodObject(schema) ? Object.keys(schema.shape) : []).map((key) => [key, ''])
			) as z.infer<T>),
			...defaultValues,
		},
	})

	useEffect(() => {
		if (prefillEmail) {
			if (isZodObject(schema) && 'email' in schema.shape) {
				AsyncStorage.getItem('user_email').then((storedEmail) => {
					if (storedEmail) {
						form.setValue(
							'email' as Path<z.infer<T>>,
							storedEmail as PathValue<z.infer<T>, Path<z.infer<T>>>
						)
					}
				})
			}
		}
	}, [prefillEmail])

	const handleSubmit = async (data: z.infer<T>) => {
		try {
			await onSubmit(data, form.setError)
		} catch (err: any) {
			Alert.alert('Submission failed', err.message || 'Something went wrong')
		}
	}

	return (
		<>
			{renderFields(fields, form.control, form.formState.errors)}

			<SubmitButton
				label={submitLabel}
				onPress={form.handleSubmit(handleSubmit)}
				submitting={form.formState.isSubmitting}
			/>
		</>
	)
}
