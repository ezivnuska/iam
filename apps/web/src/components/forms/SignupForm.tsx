// packages/ui/src/forms/SignupForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, StyleSheet, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Column, FormHeader, FormLayout, SigninForm, SubmitButton } from '@/components'
import { useAuth, useModal } from '@/hooks'
import { signupRequest } from '@services'
import { shadows } from '@/styles'

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
	const { login, user } = useAuth()
	const { hideModal, showModal } = useModal()
	
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError, trigger, getValues } = useForm<SignupFormProps>({
		resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: user?.email ?? '',
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
    }, [])

	const onSubmit = async (data: SignupFormProps) => {
		try {
            await signupRequest(data.email, data.username, data.password)  // sign up the user
            await login(data.email, data.password)  // login will update the user context automatically
		} catch (err: any) {
			if (err?.response?.data?.message) {
                const [fieldName, message] = err.response.data.message.split(':')
                setError(fieldName, { message })
            }
			Alert.alert('Registration error', err?.response?.data?.message || 'Something went wrong')
		}
	}

    const isFocused = (name: string): boolean => name === focused

    const showSigninForm = () => showModal(<SigninForm />)

	return (
		<FormLayout>
			<FormHeader title='Create Account' onCancel={hideModal} />

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
                        }}
						autoCapitalize='none'
						keyboardType='email-address'
						returnKeyType='next'
						onSubmitEditing={() => usernameInputRef.current?.focus()}
						style={[styles.input, shadows.input, isFocused('email') && styles.inputFocused]}
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
                        }}
						autoCapitalize='none'
						returnKeyType='next'
						onSubmitEditing={() => passwordInputRef.current?.focus()}
						style={[styles.input, shadows.input, isFocused('username') && styles.inputFocused]}
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
                        }}
						secureTextEntry
						autoCapitalize='none'
						returnKeyType='next'
						onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
						style={[styles.input, shadows.input, isFocused('password') && styles.inputFocused]}
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
                        }}
						secureTextEntry
						autoCapitalize='none'
						returnKeyType='done'
						onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
						style={[styles.input, shadows.input, isFocused('confirmPassword') && styles.inputFocused]}
					/>
				)}
			/>
			{errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

			<Column spacing={10}>
                <SubmitButton label='Sign Up' onPress={handleSubmit(onSubmit, onInvalid)} submitting={isSubmitting} />
                <Button label='Sign In' onPress={showSigninForm} />
            </Column>
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
})