// apps/web/src/shared/forms/MemoryForm.tsx

import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { DynamicForm, memorySchema, memoryFields } from './'
import type { MemoryFormValues } from './'
import * as memoryService from '@iam/services'
import { ImageUpload } from '@shared/images'
import DateSelector from '@shared/ui/DateSelector'
import { getDate, getMonth, getYear } from 'date-fns'
import { Memory } from '@iam/types'

type MemoryFormProps = {
	onComplete: (memory: any) => void
    memory?: Memory
}

type ImageData = {
	uri: string
	filename: string
	width?: number
	height?: number
}

export const MemoryForm = ({ onComplete, memory }: MemoryFormProps) => {
	const [localImageData, setLocalImageData] = useState<ImageData | null>(null)
	const [loading, setLoading] = useState(false)
    const [date, setDate] = useState<Date>(memory?.date || new Date())
    // const year = useMemo(() => date && getYear(date), [date])
    // const month = useMemo(() => date && getMonth(date), [date])
    // const day = useMemo(() => date && getDate(date), [date])

	const onSubmit = async (data: MemoryFormValues, setError: any) => {
		if (!localImageData && (!data.content || data.content.trim() === '')) {
			setError('content', {
				type: 'manual',
				message: 'Please provide text or an image.',
			})
			return
		}

		let newMemory = memory
		setLoading(true)
        const content = data.content ?? ''
        let uploadedImage
		try {
			if (localImageData) {
				uploadedImage = await memoryService.uploadImage({ imageData: localImageData })
			}

            if (memory) {
                newMemory = await memoryService.updateMemory(memory.id, content, date, uploadedImage?.id)
            } else {
                newMemory = await memoryService.createMemory(content, date, uploadedImage?.id)
            }
		} catch (err) {
			setError('content', { type: 'manual', message: 'Failed to create memory' })
		} finally {
			setLoading(false)
		}

		if (newMemory) onComplete(newMemory)
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
                <ImageUpload autoUpload={false} onImageSelected={setLocalImageData} />

				{/* {loading && <ActivityIndicator style={{ marginTop: 20 }} />} */}
                
			</DynamicForm>
		</View>
	)
}
