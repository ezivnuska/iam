// apps/web/src/shared/forms/PostForm.tsx

import React, { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { DynamicForm, postSchema, postFields } from './'
import type { PostFormValues } from './'
import * as postService from '@iam/services'
import { ImageUpload } from '@shared/images'

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
	const [localImageData, setLocalImageData] = useState<ImageData | null>(null)
	const [loading, setLoading] = useState(false)

	const onSubmit = async (data: PostFormValues, setError: any) => {
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

		if (newPost) onPostCreated?.(newPost)
	}

	return (
		<View style={{ alignContent: 'stretch' }}>
			<DynamicForm
				schema={postSchema}
				fields={postFields}
				onSubmit={onSubmit}
				submitLabel='Post'
				defaultValues={{ image: null }}
			>
                <ImageUpload autoUpload={false} onImageSelected={setLocalImageData} />

				{loading && <ActivityIndicator style={{ marginTop: 20 }} />}
                
			</DynamicForm>
		</View>
	)
}
