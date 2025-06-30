// packages/ui/src/forms/SigninForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller, FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Column, ModalContainer, Row, SignupForm, SubmitButton } from '@/components'
import { useAuth, useModal } from '@/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { form as styles, shadows, Size } from '@/styles'
import { User } from '@iam/types'
import { error } from 'console'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SigninFormProps = z.infer<typeof schema>

export const SigninForm = ({ signin }: { signin: (data: SigninFormProps) => {} }) => {
    const { user } = useAuth()
    const { hideModal, openFormModal, showModal } = useModal()
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
        const response: { error?: Array<string>[], result?: User | null} = await signin(data)
        console.log('response--->', response)
        if (!response) {
            console.log('Error: could not log in.')
            return null
        }
        const { error, result } = response
        if (error) {
            const [field, issue] = error
            
            if (typeof field === 'string' && typeof issue === 'string') {
                setError(field as keyof SigninFormProps, { message: issue }, { shouldFocus: true })
                Alert.alert('Login failed', issue)
                return
            }
        }
        console.log('result', result)
	}	  

    const isFocused = (name: string): boolean => name === focused

    const showSignupForm = () => showModal({ content: <SignupForm /> })
    
	return (
        <Column spacing={4}>
            <>
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
                <Text style={styles.error}>{errors.email ? errors.email.message : ' '}</Text>
            </>
            <>
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
                            returnKeyType='default'
                            onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
                            style={[styles.input, shadows.input, isFocused('password') && styles.inputFocused]}
                        />
                    )}
                />
                <Text style={styles.error}>{errors.password ? errors.password.message : ' '}</Text>
            </>    
            <Row spacing={10} justify='space-evenly'>
                <SubmitButton label='Sign In' onPress={handleSubmit(onSubmit, onInvalid)} submitting={isSubmitting} />
                <Button label='Sign Up' onPress={showSignupForm} transparent />
            </Row>
        </Column>
	)
}