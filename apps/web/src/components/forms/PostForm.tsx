// apps/web/src/components/forms/PostForm.tsx

import React, { useState } from 'react'
import { ActivityIndicator, Image, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { ImageUploader } from '@/components'
import { DynamicForm } from '@/components/forms'
import { postSchema, postFields } from '@/components/forms/schemas/post.schema'
import type { PostFormValues } from '@/components/forms/schemas/post.schema'
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
		let newPost: any

		setLoading(true)
		if (localImageData) {
			try {
				const uploadedImage = await postService.uploadImage({ imageData: localImageData })
				newPost = await postService.createPost(data.content, uploadedImage.id)
			} catch (err) {
				setError('content', { type: 'manual', message: 'Failed to create post' })
			}
		} else {
			try {
				newPost = await postService.createPost(data.content)
			} catch (err) {
				setError('content', { type: 'manual', message: 'Failed to create post' })
			}
		}

		setLoading(false)

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
				/>

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

				<ImageUploader
					onImageSelected={(imageData) => {
						setLocalImageData(imageData)
						setValue('image', undefined)
					}}
				/>

				{loading && <ActivityIndicator style={{ marginTop: 20 }} />}
			</View>
		</FormProvider>
	)
}
