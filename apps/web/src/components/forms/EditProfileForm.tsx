// apps/web/src/components/forms/EditProfileForm.tsx

import React, { useEffect, useRef, useState } from 'react'
import { TextInput, Text, Alert, TextInput as RNTextInput, View } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Column, SubmitButton } from '@/components'
import { useAuth, useModal } from '@/hooks'
import { updateSelf } from '@services'
import { form as styles, shadows, Size } from '@/styles'

const schema = z.object({
    bio: z.string(),
})

type EditProfileFormProps = z.infer<typeof schema>

export const EditProfileForm = () => {

	const { user, setUser } = useAuth()
	const { hideModal } = useModal()
    
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError, trigger, getValues } = useForm<EditProfileFormProps>({
        resolver: zodResolver(schema),
        mode: 'all',
        defaultValues: {
			bio: user?.bio ?? '',
        },
    })

    const [focused, setFocused] = useState<string | null>(null)

    const bioInputRef = useRef<RNTextInput>(null)

    const focusFirstError = (formErrors: typeof errors) => {
        if (formErrors.bio) {
            bioInputRef.current?.focus()
        }
    }

    const focusFirstEmptyField = () => {
        const values = getValues()
        if (!values.bio.length) {
            bioInputRef.current?.focus()
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

	const onSubmit = async (data: { bio: string }) => {
		if (!user?.id) {
			Alert.alert('Error', 'User ID is missing')
			return
		}

		try {
			const refreshed = await updateSelf(data)
			setUser(refreshed)
			hideModal()
		} catch (err: any) {
			Alert.alert('Update failed', err?.message || 'Unknown error')
		}
	}

    const isFocused = (name: string): boolean => name === focused

	return (
        <Column spacing={Size.S}>
            <View>
                <Controller
                    control={control}
                    name='bio'
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            ref={bioInputRef}
                            placeholder='Who are you?'
                            placeholderTextColor='#070'
                            value={value}
                            onChangeText={onChange}
                            onFocus={() => setFocused('bio')}
                            onBlur={async () => {
                                onBlur()
                                setFocused(null)
                            }}
                            autoCapitalize='sentences'
                            returnKeyType='next'
                            onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
                            style={[styles.input, styles.textArea, shadows.input, isFocused('bio') && styles.inputFocused]}
                            multiline
                        />
                    )}
                />
                <Text style={styles.error}>{errors.bio ? errors.bio.message : ' '}</Text>
            </View>
            <SubmitButton
                label='Save'
                onPress={handleSubmit(onSubmit, onInvalid)}
                disabled={isSubmitting}
            />
        </Column>
	)
}