// packages/ui/src/forms/SigninForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, StyleSheet, ActivityIndicator, Alert, TextInput as RNTextInput } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormLayout } from './FormLayout'
import { Button } from '../components'
import { useAuth, useUser } from '@providers'

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SigninFormProps = z.infer<typeof schema>

export const SigninForm = () => {
    const { login } = useAuth()
    const { email, setEmail } = useUser()

	const { control, handleSubmit, formState: { errors, isSubmitting }, setError, trigger, getValues } = useForm<SigninFormProps>({
		resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
          email: email ?? '',
          password: '',
        },
	})

    const [focused, setFocused] = useState<string | null>(null)

	const emailInputRef = useRef<RNTextInput>(null)
	const passwordInputRef = useRef<RNTextInput>(null)
    
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

    useEffect(() => {
        const validateOnMount = async () => {
            const isValid = await trigger()
            if (!isValid) {
                focusFirstError(errors)
            } else {
                focusFirstEmptyField()
            }
        }
        // emailInputRef.current?.focus()
        focusFirstEmptyField()
        // validateOnMount()
    }, [])

	const onSubmit = async (data: SigninFormProps) => {
		try {
			await login(data.email, data.password)
            await setEmail(data.email)
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
				<Button label='Log In' onPress={handleSubmit(onSubmit, onInvalid)} />
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