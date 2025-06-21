// apps/web/src/components/forms/CreatePostForm.tsx

import React, { useRef, useState } from 'react'
import {
	Image,
	Text,
	TextInput,
	ActivityIndicator,
	TextInput as RNTextInput,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ImageUploader, ModalContainer } from '@/components'
import * as postService from '@services'
import { useModal, usePosts } from '@/hooks'
import { form as styles, shadows } from '@/styles'
import type { UploadedImage } from '@iam/types'

const schema = z.object({
	content: z.string().min(1, 'Post content is required').max(280),
	image: z
		.custom<UploadedImage>()
		.optional(),
})

type CreatePostFormProps = z.infer<typeof schema>

type ImageData = {
	uri: string
	filename: string
	width?: number
	height?: number
}  

export const CreatePostForm = ({ onPostCreated }: { onPostCreated?: () => void }) => {
    const { hideModal } = useModal()
    const { addPost } = usePosts()
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		setValue,
		getValues,
	} = useForm<CreatePostFormProps>({
		resolver: zodResolver(schema),
		mode: 'all',
		defaultValues: {
			content: '',
		},
	})

	const [localImageData, setLocalImageData] = useState<ImageData | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
	const [focused, setFocused] = useState<string | null>(null)
	const contentInputRef = useRef<RNTextInput>(null)
	  
	const onSubmit = async (data: CreatePostFormProps) => {
        setUploadingImage(true)
		try {
			let uploadedImage = data.image
		
			if (localImageData) {
				uploadedImage = await postService.uploadImage({ imageData: localImageData })
                console.log('uploadedImage with post', uploadedImage)
			}
		
			const newPost = await postService.createPost(data.content, uploadedImage)
			onPostCreated?.()
			setValue('content', '')
			setValue('image', undefined)
			setLocalImageData(null)
			addPost(newPost)
			hideModal()
		} catch (err: any) {
			// error handling
		} finally {
            setUploadingImage(false)
        }
	}	  

	const focusFirstEmptyField = () => {
		if (!getValues().content.length) {
			contentInputRef.current?.focus()
		}
	}

	const onInvalid = () => {
		focusFirstEmptyField()
	}

	const isFocused = (name: string) => focused === name

    const image = getValues('image')

	return (
        <ModalContainer title='Create Post'>

            <Controller
                control={control}
                name='content'
                render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                        ref={contentInputRef}
                        placeholder={`What's on your mind?`}
                        placeholderTextColor='#070'
                        value={value}
                        multiline
                        numberOfLines={3}
                        onChangeText={onChange}
                        onFocus={() => setFocused('content')}
                        onBlur={() => {
                            onBlur()
                            setFocused(null)
                        }}
                        returnKeyType='done'
                        onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
                        style={[
                            styles.input,
                            shadows.input,
                            isFocused('content') && styles.inputFocused,
                        ]}
                    />
                )}
            />
            
            {errors.content && <Text style={styles.error}>{errors.content.message}</Text>}

            {localImageData ? (
                <Image
                    source={{ uri: localImageData.uri }}
                    style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 8 }}
                />
            ) : image ? (
                <Image
                    source={{ uri: image.url }}
                    style={{ width: 150, height: 150, marginVertical: 10, borderRadius: 8 }}
                />
            ) : null}

            <ImageUploader
                onImageSelected={(imageData) => {
                    setLocalImageData(imageData)
                    setValue('image', undefined) // clear uploaded image until upload
                }}
            />

            {isSubmitting || uploadingImage ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <Button label='Post' onPress={handleSubmit(onSubmit, onInvalid)} />
            )}
        </ModalContainer>
	)
}
