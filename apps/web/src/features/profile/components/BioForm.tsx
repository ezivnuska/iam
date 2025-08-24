// apps/web/src/features/profile/components/BioForm.tsx

import React, { useRef } from 'react'
import { Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Row } from '@shared/grid'
import { ControlledTextInput } from '@shared/forms'
import { useAuth } from '@features/auth'
import { updateSelf } from '@iam/services'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Size } from '@iam/theme'
import Feather from '@expo/vector-icons/Feather'

const schema = z.object({
	bio: z.string().max(140).optional(),
})

type BioFormProps = z.infer<typeof schema>

type Props = {
	onComplete: () => void
}

export const BioForm = ({ onComplete }: Props) => {

	const { user, setUser } = useAuth()

    const inputRef = useRef<TextInput>(null)

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isSubmitting },
        setError,
        setValue,
    } = useForm<BioFormProps>({
        resolver: zodResolver(schema),
        mode: 'all',
        defaultValues: { bio: user?.bio || '' },
    })

    const inputValue = watch('bio') || ''

	const onSubmit = async (data: BioFormProps) => {
		if (!user?.id) {
			Alert.alert('Error', 'User ID is missing')
			return
		}

		try {
			const updated = await updateSelf(data)
			setUser(updated)
			onComplete()
		} catch (err: unknown) {
			const errorObj = err as {
				response?: { data?: { error?: { details?: unknown } } }
			}
			const details = errorObj.response?.data?.error?.details

			if (Array.isArray(details) && details.length === 2) {
				const [field, issue] = details
				if (typeof field === 'string' && typeof issue === 'string') {
					setError(field as keyof BioFormProps, { message: issue }, { shouldFocus: true })
				}
			}
		}
	}

	return (
        <Row spacing={Size.S} align='flex-end'>
			<ControlledTextInput
				name='bio'
				control={control}
				error={errors.bio}
				autoFocus
				placeholder='Say something...'
				inputRef={inputRef}
				onSubmitEditing={handleSubmit(onSubmit)}
				returnKeyType='send'
			/>

			{isDirty ? (
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    style={[
                        styles.button,
                        styles.send,
                        isSubmitting && styles.disabled,
                    ]}
                >
                    <Feather name='arrow-right' size={30} color={inputValue.trim() ? '#fff' : '#000'} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={() => onComplete()}
                    disabled={isSubmitting}
                    style={[
                        styles.button,
                        styles.cancel,
                        isSubmitting && styles.disabled,
                    ]}
                >
                    <Feather name='x' size={30} color={inputValue.trim() ? '#fff' : '#000'} />
                </TouchableOpacity>
            )}
		</Row>
	)
}

const styles = StyleSheet.create({
	button: {
		borderWidth: 1,
		outlineWidth: 1,
		outlineColor: '#fff',
		height: 40,
		width: 40,
		borderRadius: 20,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	send: {
		backgroundColor: '#3a3',
	},
    cancel: {
		backgroundColor: '#c66',
	},
	disabled: {
		backgroundColor: '#666',
        cursor: 'pointer',
	},
})