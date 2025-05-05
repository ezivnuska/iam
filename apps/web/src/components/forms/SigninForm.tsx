// packages/ui/src/forms/SigninForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, StyleSheet, ActivityIndicator, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormLayout } from './FormLayout'
import { Button } from '..'
import { useAuth } from '@/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SigninFormProps = z.infer<typeof schema>

export const SigninForm = () => {
    const { login, user } = useAuth()  // no need for setUser anymore
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError, trigger, setValue, getValues } = useForm<SigninFormProps>({
		resolver: zodResolver(schema),
        mode: 'onBlur',
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
    
    const focusFirstError = (formErrors: typeof errors) => {
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

    const onInvalid = () => {
        focusFirstEmptyField()
    }

	const onSubmit = async (data: SigninFormProps) => {
		try {
			await login(data.email, data.password)  // login will set the user state
            await AsyncStorage.setItem('user_email', data.email)
		} catch (err: any) {
            if (err?.response?.data?.message) {
                const [fieldName, message] = err.response.data.message.split(':')
                setError(fieldName, { message })
            }
			Alert.alert('Login failed', err?.response?.data?.message || 'Something went wrong')
		}
	}

    const isFocused = (name: string): boolean => name === focused
    
	return (
		<FormLayout>
			<Text style={styles.title}>Sign In</Text>

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
						style={[styles.input, styles.shadow, isFocused('email') && styles.inputFocused]}
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
						style={[styles.input, styles.shadow, isFocused('password') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

			{isSubmitting ? (
				<ActivityIndicator style={{ marginTop: 20 }} />
			) : (
				<Button label='Sign In' onPress={handleSubmit(onSubmit, onInvalid)} />
			)}
		</FormLayout>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 28,
		fontWeight: '600',
		marginBottom: 24,
	},
	input: {
        width: '100%',
		padding: 12,
		marginBottom: 12,
		borderRadius: 8,
        overflow: 'hidden',
    },
    inputFocused: {
        outlineWidth: 0,
        outlineColor: 'transparent',
        borderWidth: 0,
        backgroundColor: '#ccffcc',
        borderColor: 'transparent',
    },
	error: {
		color: 'red',
		marginBottom: 8,
	},
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 2,
    },
})