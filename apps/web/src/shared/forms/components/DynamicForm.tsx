// apps/web/src/shared/forms/components/DynamicForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Alert, Platform, ScrollView, TextInput } from 'react-native'
import { useForm, UseFormSetError } from 'react-hook-form'
import { Path, PathValue } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z, ZodTypeAny, ZodObject } from 'zod'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button } from '@shared/buttons'
import { DynamicFormFields } from './'
import type { FieldConfig } from '../'

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
    children?: React.ReactNode
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
    children,
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
		if (defaultValues) {
			form.reset({
				...(Object.fromEntries(
					(isZodObject(schema) ? Object.keys(schema.shape) : []).map((key) => [key, ''])
				) as z.infer<T>),
				...defaultValues,
			})
		}
	}, [JSON.stringify(defaultValues)])	

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

	const scrollToFieldIfInvalidOrEmpty = () => {
		const data = form.getValues()
		const firstInvalid = fields.find(f => form.formState.errors[f.name])
		const firstEmpty = fields.find(f => {
			const val = data[f.name]
			return val === '' || val == null
		})
		const target = firstInvalid ?? firstEmpty
		if (target) focusAndScrollToField(target.name as string)
	}

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
		scrollToFieldIfInvalidOrEmpty()
	}, [emailPrefilled, form.formState.errors])

	// const allFieldsComplete = (data: z.infer<T>) =>
	// 	fields.every((field) => {
	// 		const val = data[field.name]
	// 		return val !== undefined && val !== null && val !== ''
	// 	})

	const handleSubmit = async (data: z.infer<T>) => {
		const isValid = await form.trigger()
	
		if (!isValid) {
            scrollToFieldIfInvalidOrEmpty()
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
			<DynamicFormFields
				fields={fields}
				control={form.control}
				errors={form.formState.errors}
				inputRefs={inputRefs}
				formValues={form.getValues()}
				triggerField={async (name) => {
					const isValid = await form.trigger(name as Path<z.infer<T>>)
					if (!isValid) {
						setTimeout(() => focusAndScrollToField(name as string), 0)
					}
					return isValid
				}}
				handleSubmit={form.handleSubmit(handleSubmit)}
			/>

            {children}

			<Button
				label={submitLabel}
				onPress={form.handleSubmit(handleSubmit)}
				showActivity={form.formState.isSubmitting}
				variant='primary'
			/>
		</>
	)
}
