// apps/web/src/fetaures/memory/components/MemoryForm.tsx

import React, { useState } from 'react'
import { View } from 'react-native'
import { memorySchema, memoryFields, type MemoryFormValues, useMemory } from '../'
import { DynamicForm } from '@shared/forms'
import * as memoryService from '@iam/services'
import { ImageUpload } from '@shared/images'
import DateSelector from '@shared/ui/DateSelector'
import { Memory } from '@iam/types'

type MemoryFormProps = {
    memory?: Memory
}

type ImageData = {
	uri: string
	filename: string
	width?: number
	height?: number
}

export const MemoryForm = ({ memory }: MemoryFormProps) => {
    
	const [localImageData, setLocalImageData] = useState<ImageData | null>(null)
	const [loading, setLoading] = useState(false)
    const [date, setDate] = useState<Date>(memory?.date || new Date())

    const { addMemory, updateMemory } = useMemory()
    
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
            else addMemory(newMemory)
        }
	}

	return (
		<View style={{ flex: 1, alignContent: 'stretch' }}>
			<DynamicForm
				schema={memorySchema}
				fields={memoryFields}
				onSubmit={onSubmit}
				submitLabel='Save Memory'
				defaultValues={memory}
			>
                <DateSelector onChange={setDate} memory={memory} />
                <ImageUpload
                    autoUpload={false}
                    onImageSelected={setLocalImageData}
                    preview={memory?.image}
                />
                
			</DynamicForm>
		</View>
	)
}
