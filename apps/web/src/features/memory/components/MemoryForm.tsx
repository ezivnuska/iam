// apps/web/src/fetaures/memory/components/MemoryForm.tsx

import React, { useRef, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { useMemory } from '../'
import { ControlledTextInput, DynamicForm } from '@shared/forms'
import * as memoryService from '@iam/services'
import { ImageUpload } from '@shared/images'
import DateSelector from '@shared/ui/DateSelector'
import { Memory } from '@iam/types'
import { useForm, FormProvider, UseFormSetError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodTypeAny, ZodObject } from 'zod'
import type { FieldConfig } from '@shared/forms'
import type { UploadedImage } from '@iam/types'
import Feather from '@expo/vector-icons/Feather'
import { Column } from '@shared/grid'
import { useModal } from '@shared/hooks'

export const schema = z
	.object({
		content: z.string().max(280).optional(),
        image: z
            .custom<UploadedImage>()
            .optional()
            .nullable(),
	})

// export const memoryFields: FieldConfig<MemoryFormValues>[] = [
//     { name: 'content', autoFocus: true, placeholder: 'Remember...' },
// ]

export type MemoryFormValues = z.infer<typeof schema>

type MemoryFormProps = {
    memory?: Memory
}

type ImageData = {
	uri: string
	filename: string
	width?: number
	height?: number
}

function isZodObject(schema: z.ZodTypeAny): schema is ZodObject<any> {
    return (schema as any).shape !== undefined
}

export const MemoryForm = ({ memory }: MemoryFormProps) => {
    
	const [localImageData, setLocalImageData] = useState<ImageData | null>(null)
	const [loading, setLoading] = useState(false)
    const [date, setDate] = useState<Date>(memory?.date || new Date())
    const inputRef = useRef(null)
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isSubmitting },
        setError,
        setValue,
    } = useForm<MemoryFormValues>({
        resolver: zodResolver(schema),
        mode: 'all',
        defaultValues: { content: '' },
    })

    const { addMemory, updateMemory } = useMemory()
    const { hideModal } = useModal()
    
	const onSubmit = async (data: MemoryFormValues, setError: any) => {
		if (!localImageData && (!data.content || data.content.trim() === '')) {
			setError('content', {
				type: 'manual',
				message: 'Please provide text or an image.',
			})
			return
		}

		let newMemory
		setLoading(true)
        const content = data.content ?? ''
        let uploadedImage
        if (localImageData) {
            try {
				uploadedImage = await memoryService.uploadImage({ imageData: localImageData })
            } catch (err) {
                setError('image', { type: 'manual', message: 'Failed to upload memory image' })
            }
        }
        
        if (memory) {
            try {
                newMemory = await memoryService.updateMemory(memory.id, content, date, uploadedImage?.id)
            } catch (err) {
                setError('content', { type: 'manual', message: 'Failed to update memory' })
            }
        } else {
            try {
                newMemory = await memoryService.createMemory(content, date, uploadedImage?.id)
            } catch (err) {
                setError('content', { type: 'manual', message: 'Failed to create memory' })
            }
        }

		setLoading(false)

        console.log('newMemory', newMemory)
        console.log('memory', memory)

        if (newMemory) {
            if (memory) updateMemory(newMemory)
            else {
        console.log('adding new memory', newMemory)
                addMemory(newMemory)
            }
        }
	}

    const inputValue = watch('content') || ''

	return (
		<Column
            flex={1}
            spacing={12}
            style={{ alignContent: 'stretch' }}
        >
            <DateSelector onChange={setDate} memory={memory} />
            
            <ControlledTextInput
                inputRef={inputRef}
                name='content'
                control={control}
                error={errors.content}
                autoFocus
                placeholder='Say something...'
                onSubmitEditing={handleSubmit(onSubmit)}
                returnKeyType='send'
            />

            <ImageUpload
                autoUpload={false}
                onImageSelected={setLocalImageData}
                preview={memory?.image}
            />

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                style={[
                    styles.button,
                    styles.send,
                    errors.content && styles.disabled,
                ]}
            >
                <Feather name='arrow-right' size={30} color={inputValue.trim() ? '#fff' : '#000'} />
            </TouchableOpacity>
		</Column>
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