// apps/web/src/components/FullScreenImage.tsx

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
	AddCommentForm,
	AutoSizeImage,
	Column,
	ImageComments,
	LikeCommentBar,
	Row,
} from '@/components'
import { Size, resolveResponsiveProp } from '@/styles'
import { useModal, useBestVariant } from '@/hooks'
import type { Image } from '@iam/types'
import {
	fetchImageCommentCount,
	fetchImageLikes,
	toggleImageLike,
} from '@services'

type Props = {
	image: Image
	onClose: () => void
	onDelete?: () => void
	onSetAvatar?: () => void
	isAvatar?: boolean
}

const FullScreenImage: React.FC<Props> = ({
	image,
	onClose,
	onDelete,
	onSetAvatar,
	isAvatar,
}) => {
	const [likeCount, setLikeCount] = useState(0)
	const [liked, setLiked] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const [commentCount, setCommentCount] = useState(0)
	const [commentRefreshToken, setCommentRefreshToken] = useState(0)

	const { hideModal, showModal } = useModal()
	const { width, height } = useWindowDimensions()
	const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })

	const bestVariantUrl = useBestVariant(image, width - paddingHorizontal * 2)
	const bestVariant = image.variants.find(v => bestVariantUrl.includes(v.filename))

	// Adjust dimensions to fit screen and maintain aspect ratio
	let displayWidth = width - paddingHorizontal * 2
	let displayHeight = height - paddingHorizontal * 2

	if (bestVariant?.width && bestVariant?.height) {
		const aspectRatio = bestVariant.width / bestVariant.height
		if (displayWidth / aspectRatio <= displayHeight) {
			displayHeight = displayWidth / aspectRatio
		} else {
			displayWidth = displayHeight * aspectRatio
		}
	}

	useEffect(() => {
		const loadMeta = async () => {
			try {
				const [likes, comments] = await Promise.all([
					fetchImageLikes(image.id),
					fetchImageCommentCount(image.id),
				])
				setLikeCount(likes.count)
				setLiked(likes.likedByCurrentUser)
				setCommentCount(comments)
			} catch (err) {
				console.error('Failed to load image metadata:', err)
			}
		}
		loadMeta()
	}, [image.id])

	const refreshCommentCount = async () => {
		try {
			const count = await fetchImageCommentCount(image.id)
			setCommentCount(count)
		} catch (err) {
			console.error('Failed to refresh comment count:', err)
		}
	}

	const handleToggleLike = async () => {
		try {
			const result = await toggleImageLike(image.id)
			setLiked(result.likedByCurrentUser)
			setLikeCount(result.count)
		} catch (err) {
			console.error('Failed to toggle like:', err)
		}
	}

	const handleAddComment = () => {
		showModal({
            content: (
                <AddCommentForm
                    id={image.id}
                    type='Image'
                    onCommentAdded={() => {
                        setExpanded(true)
                        refreshCommentCount()
                        setCommentRefreshToken(prev => prev + 1)
                    }}
                />
            )
        })
	}

	const handleCommentDeleted = () => {
		refreshCommentCount()
		setCommentRefreshToken(prev => prev + 1)
		if (commentCount === 1) setExpanded(false)
	}

	return (
		<View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
			<View style={styles.imageContainer}>
				{/* Header */}
				<View style={[styles.header, { paddingHorizontal }]}>
					<Row justify='flex-start' spacing={16}>
						{onDelete && (
							<Pressable onPress={onDelete}>
								<Ionicons name='trash-bin' size={28} color='#fff' />
							</Pressable>
						)}
						{onSetAvatar && (
							<Pressable onPress={onSetAvatar}>
								<FontAwesome
									name='user-circle-o'
									size={24}
									color={isAvatar ? '#3498db' : '#fff'}
								/>
							</Pressable>
						)}
					</Row>
					<Pressable onPress={onClose}>
						<Ionicons name='close-sharp' size={28} color='#fff' />
					</Pressable>
				</View>

				{/* Image */}
				<View style={styles.imageWrapper}>
					<AutoSizeImage
						image={image}
						resizeMode='contain'
						style={{ width: displayWidth, height: displayHeight }}
					/>
				</View>

				{/* Footer */}
				<Column spacing={Size.S} style={styles.footer}>
					<LikeCommentBar
						likeCount={likeCount}
						liked={liked}
						commentCount={commentCount}
						isAuthenticated
						onToggleLike={handleToggleLike}
						onToggleComments={() => setExpanded(prev => !prev)}
						onAddComment={handleAddComment}
						textColor='#fff'
						iconColor='#fff'
						expanded={expanded}
					/>
					{expanded && (
						<ImageComments
							key={commentRefreshToken}
							refId={image.id}
							onCommentDeleted={handleCommentDeleted}
						/>
					)}
				</Column>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	fullscreenContainer: {
		backgroundColor: '#000',
	},
	imageContainer: {
		flex: 1,
		position: 'relative',
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 50,
		zIndex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	imageWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		paddingVertical: Size.S,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		backgroundColor: 'rgba(0,0,0,0.4)',
		maxHeight: '50%',
	},
})

export default FullScreenImage
