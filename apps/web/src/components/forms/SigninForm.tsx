// packages/ui/src/forms/SigninForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller, FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Column, FormHeader, FormLayout, SignupForm, SubmitButton } from '@/components'
import { useAuth, useModal } from '@/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { form as styles, shadows } from '@/styles'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SigninFormProps = z.infer<typeof schema>

export const SigninForm = () => {
    const { login, user } = useAuth()
    const { hideModal, showModal } = useModal()
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError, trigger, setValue, getValues } = useForm<SigninFormProps>({
		resolver: zodResolver(schema),
        mode: 'all',
        defaultValues: {
          email: user?.email ?? '',
          password: '',
        },
	})

    const [focused, setFocused] = useState<string | null>(null)

	const emailInputRef = useRef<RNTextInput>(null)
	const passwordInputRef = useRef<RNTextInput>(null)

    useEffect(() => {
        const loadStoredEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('user_email')
                if (storedEmail) {
                    setValue('email', storedEmail)
                }
            } catch (err) {
                console.warn('Failed to load stored email:', err)
            }
            focusFirstEmptyField()
        }
    
        loadStoredEmail()
    }, [])
    
    const focusFirstError = (formErrors: FieldErrors<SigninFormProps>) => {
		if (formErrors.email) {
			emailInputRef.current?.focus()
		} else if (formErrors.password) {
			passwordInputRef.current?.focus()
		}
	}	  

    const focusFirstEmptyField = () => {
        const values = getValues()
        if (!values.email.length) {
            emailInputRef.current?.focus()
        } else if (!values.password.length) {
            passwordInputRef.current?.focus()
        }
    }

    const onInvalid = (errors: FieldErrors<SigninFormProps>) => {
		focusFirstError(errors)
	}	  

	const onSubmit = async (data: SigninFormProps) => {
		try {
			await login(data.email, data.password)
			await AsyncStorage.setItem('user_email', data.email)
			hideModal()
		} catch (err: unknown) {
			const errorObj = err as {
				response?: {
					data?: {
						error?: {
							details?: unknown
						}
					}
				}
			}
		
			const details = errorObj.response?.data?.error?.details
		
			if (Array.isArray(details) && details.length === 2) {
				const [field, issue] = details
		
				if (typeof field === 'string' && typeof issue === 'string') {
					setError(field as keyof SigninFormProps, { message: issue }, { shouldFocus: true })
					Alert.alert('Login failed', issue)
					return
				}
			}
			
			Alert.alert('Login failed', 'Something went wrong')
		}
	}	  

    const isFocused = (name: string): boolean => name === focused

    const showSignupForm = () => showModal(<SignupForm />)
    
	return (
		<FormLayout>
			<FormHeader title='Sign In' onCancel={hideModal} />

			<Controller
				control={control}
				name='email'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
                        ref={emailInputRef}
                        autoFocus
						placeholder='Email'
                        placeholderTextColor='#070'
						value={value}
						onChangeText={onChange}
                        onFocus={() => setFocused('email')}
                        onBlur={() => {
                            onBlur()
                            setFocused(null)
                        }}
						autoCapitalize='none'
						keyboardType='email-address'
						returnKeyType='next'
						onSubmitEditing={() => passwordInputRef.current?.focus()}
						style={[styles.input, shadows.input, isFocused('email') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

			<Controller
				control={control}
				name='password'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={passwordInputRef}
						placeholder='Password'
                        placeholderTextColor='#070'
						value={value}
						onChangeText={onChange}
                        onFocus={() => setFocused('password')}
                        onBlur={() => {
                            onBlur()
                            setFocused(null)
                        }}
						secureTextEntry
						autoCapitalize='none'
						returnKeyType='done'
						onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
						style={[styles.input, shadows.input, isFocused('password') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
            
            <Column spacing={10}>
                <SubmitButton label='Sign In' onPress={handleSubmit(onSubmit, onInvalid)} submitting={isSubmitting} />
                <Button label='Sign Up' onPress={showSignupForm} />
            </Column>
		</FormLayout>
	)
}