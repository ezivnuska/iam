// apps/web/src/components/forms/DynamicForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Alert, Platform, ScrollView, TextInput } from 'react-native'
import { useForm, UseFormSetError } from 'react-hook-form'
import { Control, FieldValues, Path, PathValue } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z, ZodTypeAny, ZodObject } from 'zod'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Column, FormField, SubmitButton } from '@/components'
import type { FieldConfig } from '@/types'

interface DynamicFormProps<T extends ZodTypeAny> {
	schema: T
	fields: FieldConfig<z.infer<T>>[]
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
	const scrollViewRef = useRef<ScrollView>(null)

	fields.forEach(({ name }) => {
		if (!inputRefs.current[name as string]) {
			inputRefs.current[name as string] = React.createRef<TextInput>()
		}
	})

	const [emailPrefilled, setEmailPrefilled] = useState(!prefillEmail)

    useEffect(() => {
        form.reset({
            ...(Object.fromEntries(
                (isZodObject(schema) ? Object.keys(schema.shape) : []).map((key) => [key, ''])
            ) as z.infer<T>),
            ...defaultValues,
        })
    }, [defaultValues])      

	useEffect(() => {
		if (prefillEmail && isZodObject(schema) && 'email' in schema.shape) {
			AsyncStorage.getItem('user_email').then((storedEmail) => {
				if (storedEmail) {
					form.setValue(
						'email' as Path<z.infer<T>>,
						storedEmail as PathValue<z.infer<T>, Path<z.infer<T>>>
					)
				}
				setEmailPrefilled(true)
			})
		} else {
			setEmailPrefilled(true)
		}
	}, [prefillEmail])

	const focusAndScrollToField = (fieldName: string) => {
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
			
					ref.current?.measureLayout(
						scrollViewRef.current?.getInnerViewNode(),
						(x, y, width, height) => {
							scrollViewRef.current?.scrollTo({ y: y - 20, animated: true })
						},
						() => console.warn('measureLayout error')
					)
				}, 100)
			}
		}
	}

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
			focusAndScrollToField(targetField.name as string)
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
				focusAndScrollToField(firstInvalid.name as string)
			}
			return
		}
	
		if (!allFieldsComplete(data)) {
			const firstEmpty = fields.find((f) => {
				const val = data[f.name]
				return val === undefined || val === null || val === ''
			})
			if (firstEmpty) {
				focusAndScrollToField(firstEmpty.name as string)
			}
			return
		}
	
		try {
			await onSubmit(data, form.setError)
			const errorField = fields.find((field) => form.formState.errors[field.name])
			if (errorField) {
				focusAndScrollToField(errorField.name as string)
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
							focusAndScrollToField(name as string)
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

function renderFields<T extends FieldValues>(
	fields: FieldConfig<T>[],
	control: Control<T>,
	errors: Partial<Record<keyof T, any>>,
	inputRefs: React.RefObject<Record<string, React.RefObject<TextInput | null>>>,
	formValues: Partial<T>,
	triggerField: (name: keyof T) => Promise<boolean>,
	handleSubmit: () => void
) {
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