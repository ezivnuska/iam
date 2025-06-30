// apps/web/src/components/UserImageManager.tsx

import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Column, FullScreenImage, ImageGallery, ImageManagerHeader } from '@/components'
import { useAuth, useImage, useModal } from '@/hooks'
import type { Image, User } from '@iam/types'

interface UserImageManagerProps {
	owner?: User | null
}

const UserImageManager: React.FC<UserImageManagerProps> = ({ owner }) => {
	const { user: authUser } = useAuth()
	const isAdmin = authUser?.role === 'admin'
	const isOwner = !!owner && !!authUser?.username && authUser.username === owner.username
	
	const {
		images,
		isLoading,
		deleteImage,
		setAvatar,
		currentAvatarId,
		loadImages,
		hasNextPage,
	} = useImage()

	const { hideModal, openFormModal } = useModal()
	const [error, setError] = useState<string | null>(null)

    useEffect(() => {
		if (images.length === 0 && !isLoading) {
			loadImages(owner?.id)
		}
	}, [images.length, isLoading, loadImages])

	const handleDelete = async (id: string) => {
		if (!isAdmin) return
		try {
			if (id === currentAvatarId) await setAvatar(undefined)
			await deleteImage(id)
			hideModal()
		} catch (err) {
			console.error('Failed to delete image:', err)
			setError('Failed to delete image.')
		}
	}

	const handleSetAvatar = async (id: string | undefined) => {
		const newAvatarId = id === currentAvatarId ? undefined : id
		try {
			await setAvatar(newAvatarId)
		} catch (err) {
			console.error('Failed to set avatar')
			setError('Failed to set avatar.')
		}
	}

	const handleImagePress = (image: Image) => {
		const isAvatar = image.id === currentAvatarId

        openFormModal(FullScreenImage, {
            image,
            onClose: hideModal,
            onDelete: (isAdmin || isOwner) ? () => handleDelete(image.id) : undefined,
            onSetAvatar: isOwner ? () => handleSetAvatar(image.id) : undefined,
            isAvatar,
        }, { fullscreen: true })
	}

	return (
		<Column flex={1} spacing={10}>
			<ImageManagerHeader />
			{error ? (
				<Text>{error}</Text>
			) : (
				<ImageGallery
					images={images}
					currentAvatarId={currentAvatarId}
					onImagePress={handleImagePress}
					loading={isLoading}
					onEndReached={() => hasNextPage && loadImages()}
				/>
			)}
		</Column>
	)
}

export default UserImageManager
