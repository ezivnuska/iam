// apps/web/src/components/forms/EditProfileForm.tsx

import React, { useEffect, useRef } from 'react'
import { TextInput, StyleSheet, Text, Alert, TextInput as RNTextInput } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { Button, FormLayout, FormHeader } from '@/components'
import { useAuth, useModal } from '@/hooks'
import { updateSelf } from '@services'

export const EditProfileForm = () => {
	const { user, setUser } = useAuth()
	const { hideModal } = useModal()

	const { control, handleSubmit, formState: { errors, isSubmitting }, reset, getValues } = useForm({
		defaultValues: {
			bio: user?.bio ?? '',
		}
	})

    const bioInputRef = useRef<RNTextInput>(null)

    useEffect(() => {
        if (user?.bio !== undefined) {
            reset({ bio: user.bio })
        }
    }, [user, reset])

    const focusFirstEmptyField = () => {
        const values = getValues()
        if (!values.bio.length) {
            bioInputRef.current?.focus()
        }
    }

    const onInvalid = () => {
        focusFirstEmptyField()
    }

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

	return (
		<FormLayout>
			<FormHeader title='Edit Bio' onCancel={hideModal} />
			<Controller
				control={control}
				name='bio'
				render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                        ref={bioInputRef}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                        style={styles.textInput}
                        placeholder='Tell us about yourself'
                    />
				)}
			/>
			{errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}

			<Button
				label='Save'
				onPress={handleSubmit(onSubmit, onInvalid)}
				disabled={isSubmitting}
			/>
		</FormLayout>
	)
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	label: { fontWeight: 'bold', marginBottom: 8 },
	textInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 12,
		height: 100,
		textAlignVertical: 'top',
		marginBottom: 16,
	},
	error: { color: 'red', marginBottom: 8 },
})