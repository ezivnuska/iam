// packages/ui/src/forms/SignupForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, StyleSheet, ActivityIndicator, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormLayout } from './FormLayout'
import { Button } from '../components'
import { useAuth, useUser } from '@providers'
import { signupRequest } from '@services'

const schema = z.object({
	email: z.string().email(),
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Passwords do not match',
	path: ['confirmPassword'],
})

type SignupFormProps = z.infer<typeof schema>

export const SignupForm = () => {
	const { login } = useAuth()
	const { email, setEmail } = useUser()
	
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError, trigger, getValues } = useForm<SignupFormProps>({
		resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: email ?? '',
            username: '',
            password: '',
            confirmPassword: '',
        },
	})

    const [focused, setFocused] = useState<string | null>(null)

	const emailInputRef = useRef<RNTextInput>(null)
	const usernameInputRef = useRef<RNTextInput>(null)
	const passwordInputRef = useRef<RNTextInput>(null)
	const confirmPasswordInputRef = useRef<RNTextInput>(null)

    const focusFirstError = (formErrors: typeof errors) => {
        if (formErrors.email) {
            emailInputRef.current?.focus()
        } else if (formErrors.username) {
            usernameInputRef.current?.focus()
        } else if (formErrors.password) {
            passwordInputRef.current?.focus()
        } else if (formErrors.confirmPassword) {
            confirmPasswordInputRef.current?.focus()
        }
    }

    const focusFirstEmptyField = () => {
        const values = getValues()
        if (!values.email.length) {
            emailInputRef.current?.focus()
        } else if (!values.username.length) {
            usernameInputRef.current?.focus()
        } else if (!values.password.length) {
            passwordInputRef.current?.focus()
        } else if (!values.confirmPassword.length) {
            confirmPasswordInputRef.current?.focus()
        }
    }

    const onInvalid = () => {
        focusFirstEmptyField()
    }

    useEffect(() => {
        const validateOnMount = async () => {
            const isValid = await trigger()
            if (!isValid) {
                focusFirstError(errors)
            } else {
                focusFirstEmptyField()
            }
        }
    
        focusFirstEmptyField()
        // validateOnMount()
    }, [])

	const onSubmit = async (data: SignupFormProps) => {
		try {
            await signupRequest(data.email, data.username, data.password)
            await setEmail(data.email)
			await login(data.email, data.password)
		} catch (err: any) {
			if (err?.response?.data?.message) {
                const [fieldName, message] = err.response.data.message.split(':')
                setError(fieldName, { message })
            }
			Alert.alert('Registration error', err?.response?.data?.message || 'Something went wrong')
		}
	}

    const isFocused = (name: string): boolean => name === focused

	return (
		<FormLayout>
			<Text style={styles.title}>Create Account</Text>

			<Controller
				control={control}
				name='email'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
                        ref={emailInputRef}
                        autoFocus
						placeholder='email'
                        placeholderTextColor='#070'
						value={value}
						onChangeText={onChange}
                        onFocus={() => setFocused('email')}
						onBlur={async () => {
                            onBlur()
                            setFocused(null)
                            // const valid = await trigger('email')
                            // if (!valid) {
                            //     focusFirstError(errors)
                            // }
                        }}
						autoCapitalize='none'
						keyboardType='email-address'
						returnKeyType='next'
						onSubmitEditing={() => usernameInputRef.current?.focus()}
						style={[styles.input, styles.shadow, isFocused('email') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

			<Controller
				control={control}
				name='username'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={usernameInputRef}
						placeholder='username'
                        placeholderTextColor='#070'
						value={value}
						onChangeText={onChange}
                        onFocus={() => setFocused('username')}
						onBlur={async () => {
                            onBlur()
                            setFocused(null)
                            // const valid = await trigger('username')
                            // if (!valid) {
                            //     focusFirstError(errors)
                            // }
                        }}
						autoCapitalize='none'
						returnKeyType='next'
						onSubmitEditing={() => passwordInputRef.current?.focus()}
						style={[styles.input, styles.shadow, isFocused('username') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

			<Controller
				control={control}
				name='password'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={passwordInputRef}
						placeholder='password'
                        placeholderTextColor='#070'
						value={value}
						onChangeText={onChange}
                        onFocus={() => setFocused('password')}
						onBlur={async () => {
                            onBlur()
                            setFocused(null)
                            // const valid = await trigger('password')
                            // if (!valid) {
                            //     focusFirstError(errors)
                            // }
                        }}
						secureTextEntry
						autoCapitalize='none'
						returnKeyType='next'
						onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
						style={[styles.input, styles.shadow, isFocused('password') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

			<Controller
				control={control}
				name='confirmPassword'
				render={({ field: { value, onChange, onBlur } }) => (
					<TextInput
						ref={confirmPasswordInputRef}
						placeholder='password again'
                        placeholderTextColor='#070'
						value={value}
						onChangeText={onChange}
                        onFocus={() => setFocused('confirmPassword')}
						onBlur={async () => {
                            onBlur()
                            setFocused(null)
                            // const valid = await trigger('confirmPassword')
                            // if (!valid) {
                            //     focusFirstError(errors)
                            // }
                        }}
						secureTextEntry
						autoCapitalize='none'
						returnKeyType='done'
						onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
						style={[styles.input, styles.shadow, isFocused('confirmPassword') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

			{isSubmitting ? (
				<ActivityIndicator style={{ marginTop: 20 }} />
			) : (
				<Button label='Sign Up' onPress={handleSubmit(onSubmit, onInvalid)} />
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