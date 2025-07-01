// apps/web/src/components/forms/DynamicForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Alert, Platform, TextInput } from 'react-native'
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
	submitLabel: string
	prefillEmail?: boolean
	defaultValues?: Partial<z.infer<T>>
	onSubmit: (
		data: z.infer<T>,
		setError: UseFormSetError<z.infer<T>>
	) => Promise<void>
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

	const inputRefs = useRef<Record<string, React.RefObject<TextInput | null>>>({})

	fields.forEach(({ name }) => {
		if (!inputRefs.current[name]) {
			inputRefs.current[name] = React.createRef<TextInput>()
		}
	})

	// State to track if prefill is done
	const [emailPrefilled, setEmailPrefilled] = useState(!prefillEmail)

	// Prefill email effect
	useEffect(() => {
		if (prefillEmail && isZodObject(schema) && 'email' in schema.shape) {
			AsyncStorage.getItem('user_email').then((storedEmail) => {
				if (storedEmail) {
					form.setValue(
						'email' as Path<z.infer<T>>,
						storedEmail as PathValue<z.infer<T>, Path<z.infer<T>>>
					)
				}
				setEmailPrefilled(true) // Mark prefill as done, even if no email found
			})
		} else {
			setEmailPrefilled(true) // No prefill required
		}
	}, [prefillEmail])

	const focusAndMoveCursorToEnd = (fieldName: string) => {
		const ref = inputRefs.current[fieldName]
		if (ref?.current) {
			ref.current.focus()

			if (Platform.OS !== 'web') {
				setTimeout(() => {
					const value = form.getValues()[fieldName]
					if (typeof value === 'string') {
						ref.current?.setNativeProps?.({
							selection: { start: value.length, end: value.length },
						})
					}
				}, 0)
			}
		}
	}

	// Autofocus effect runs only after emailPrefilled is true
	useEffect(() => {
		if (!emailPrefilled) return

		const data = form.getValues()

		const firstInvalid = fields.find(field => !!form.formState.errors[field.name])

		const firstIncomplete = fields.find(field => {
			const value = data[field.name]
			return value === undefined || value === null || value === ''
		})

		const targetField = firstInvalid ?? firstIncomplete
		if (targetField) {
			focusAndMoveCursorToEnd(targetField.name as string)
		}
	}, [emailPrefilled, form.formState.errors])

	const allFieldsComplete = (data: z.infer<T>) =>
		fields.every((field) => {
			const val = data[field.name]
			return val !== undefined && val !== null && val !== ''
		})

	const handleSubmit = async (data: z.infer<T>) => {
		const isValid = await form.trigger()
	
		if (!isValid) {
			const firstInvalid = fields.find((f) => form.formState.errors[f.name])
			if (firstInvalid) {
				focusAndMoveCursorToEnd(firstInvalid.name)
			}
			return;
		}
	
		if (!allFieldsComplete(data)) {
			const firstEmpty = fields.find((f) => {
				const val = data[f.name]
				return val === undefined || val === null || val === ''
			})
			if (firstEmpty) {
				focusAndMoveCursorToEnd(firstEmpty.name)
			}
			return
		}
	
		try {
			await onSubmit(data, form.setError)
			const errorField = fields.find((field) => form.formState.errors[field.name])
			if (errorField) {
				focusAndMoveCursorToEnd(errorField.name as string)
			}
		} catch (err: any) {
			Alert.alert('Submission failed', err.message || 'Something went wrong')
		}
	}

	return (
		<>
			{renderFields(
				fields,
				form.control,
				form.formState.errors,
				inputRefs,
				form.getValues(),
				async (name: keyof z.infer<T>) => {
					const isValid = await form.trigger(name as Path<z.infer<T>>)
					if (!isValid) {
						setTimeout(() => {
							focusAndMoveCursorToEnd(name as string)
						}, 0)
					}
					return isValid
				},
				form.handleSubmit(handleSubmit)
			)}

			<SubmitButton
				label={submitLabel}
				onPress={form.handleSubmit(handleSubmit)}
				submitting={form.formState.isSubmitting}
			/>
		</>
	)
}
