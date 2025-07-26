// apps/web/src/shared/forms/PostForm.tsx

import React, { useState } from 'react'
import { ActivityIndicator, Image, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { ImageUploadModal } from '@shared/modals'
import { DynamicForm, postSchema, postFields } from './'
import type { PostFormValues } from './'
import * as postService from '@services'
import { zodResolver } from '@hookform/resolvers/zod'

type PostFormProps = {
	onPostCreated?: (post: any) => void
}

type ImageData = {
	uri: string
	filename: string
	width?: number
	height?: number
}

export const PostForm = ({ onPostCreated }: PostFormProps) => {
	const methods = useForm<PostFormValues>({
		resolver: zodResolver(postSchema),
		mode: 'all',
		defaultValues: {
			content: '',
			image: undefined,
		},
	})

	const { setValue, watch, setError } = methods
	const [localImageData, setLocalImageData] = useState<ImageData | null>(null)
	const [loading, setLoading] = useState(false)

	const image = watch('image')

	const onSubmit = async (data: PostFormValues) => {
        if (!localImageData && (!data.content || data.content.trim() === '')) {
            setError('content', {
                type: 'manual',
                message: 'Please provide text or an image.',
            })
            return
        }
    
        let newPost: any
        setLoading(true)
    
        try {
            const content = data.content ?? ''

            if (localImageData) {
                const uploadedImage = await postService.uploadImage({ imageData: localImageData })
                newPost = await postService.createPost(content, uploadedImage.id)
            } else {
                newPost = await postService.createPost(content)
            }
        } catch (err) {
            setError('content', { type: 'manual', message: 'Failed to create post' })
        } finally {
            setLoading(false)
        }
    
        if (newPost) {
            onPostCreated?.(newPost)
        }
    }    

	return (
		<FormProvider {...methods}>
			<View>
				<DynamicForm
					schema={postSchema}
					fields={postFields}
					onSubmit={onSubmit}
					submitLabel='Post'
					defaultValues={{ image: null }}
				>

                    {localImageData ? (
                        <Image
                            source={{ uri: localImageData.uri }}
                            style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 8 }}
                        />
                    ) : image?.url ? (
                        <Image
                            source={{ uri: image.url }}
                            style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 8 }}
                        />
                    ) : null}

                    <ImageUploadModal
                        onImageSelected={(imageData) => {
                            setLocalImageData(imageData)
                            setValue('image', undefined)
                        }}
                    />

                    {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
                </DynamicForm>
			</View>
		</FormProvider>
	)
}
