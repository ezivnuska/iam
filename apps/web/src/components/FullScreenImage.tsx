// apps/web/src/components/FullScreenImage.tsx

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Pressable, Text, useWindowDimensions } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { AddCommentForm, AutoSizeImage, Column, ImageComments, Row } from '.'
import { Size, resolveResponsiveProp } from '../styles'
import { useAuth, useModal, useBestVariant } from '@/hooks'
import type { Image } from '@iam/types'
import { fetchImageCommentCount, fetchImageLikes, toggleImageLike } from '@services'

const FullScreenImage = ({
	image,
	onClose,
	onDelete,
	onSetAvatar,
	isAvatar,
}: {
	image: Image
	onClose: () => void
	onDelete?: () => void
	onSetAvatar?: () => void
	isAvatar?: boolean
}) => {
    const [likeCount, setLikeCount] = useState(0)
	const [liked, setLiked] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [commentCount, setCommentCount] = useState(0)
    const [commentRefreshToken, setCommentRefreshToken] = useState(0)

    const { showModal } = useModal()

	const paddingHorizontal = resolveResponsiveProp({ xs: 8, sm: 8, md: 16, lg: 24 })
	const { width: screenWidth, height: screenHeight } = useWindowDimensions()

	// Calculate responsive size preserving aspect ratio
	let displayWidth = screenWidth - paddingHorizontal * 2
	let displayHeight = screenHeight - paddingHorizontal * 2

	// Get the best variant URL using your hook
	const bestVariantUrl = useBestVariant(image, displayWidth)

	// You can also get the variant details (width/height) from image.variants here if needed
	// For example, find the variant matching bestVariantUrl:
	const bestVariant = image.variants.find(variant => {
		// Assuming getBestVariantUrl returns a URL that includes the variant filename
		return bestVariantUrl.includes(variant.filename)
	})

	if (bestVariant?.width && bestVariant?.height) {
		const aspectRatio = bestVariant.width / bestVariant.height
		// Adjust width and height based on screen orientation
		if (displayWidth / aspectRatio <= displayHeight) {
			displayHeight = displayWidth / aspectRatio
		} else {
			displayWidth = displayHeight * aspectRatio
		}
	}

    useEffect(() => {
		const loadMeta = async () => {
            try {
                const [likesData, commentCount] = await Promise.all([
                    fetchImageLikes(image.id),
                    fetchImageCommentCount(image.id),
                ])
                setLikeCount(likesData.count)
                setLiked(likesData.likedByCurrentUser)
                setCommentCount(commentCount)
            } catch (err) {
                console.error('Failed to load image meta:', err)
            }
        }
        loadMeta()
	}, [image.id])

    const handleToggleLike = async () => {
		try {
			const data = await toggleImageLike(image.id)
			setLiked(data.likedByCurrentUser)
			setLikeCount(data.count)
		} catch (err) {
			console.error('Failed to toggle image like:', err)
		}
	}

    const handleToggleComments = () => {
        setExpanded((prev) => !prev)
    }

    const refreshCommentCount = async () => {
        try {
            const count = await fetchImageCommentCount(image.id)
            setCommentCount(count)
        } catch (err) {
            console.error('Failed to refresh comment count:', err)
        }
    }    

    const handleAddComment = () => {
        showModal(
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
    }    

	return (
		<View style={[StyleSheet.absoluteFill, styles.fullscreenContainer]}>
			<View style={[StyleSheet.absoluteFill, styles.imageContainer]}>
				<View style={[styles.header, { paddingHorizontal }]}>
					<Row justify='flex-start' spacing={16}>
						{onDelete && (
							<Pressable onPress={onDelete}>
								<Ionicons name='trash-bin' size={28} color='white' />
							</Pressable>
						)}
						{onSetAvatar && (
							<Pressable onPress={onSetAvatar}>
								<FontAwesome name='user-circle-o' size={24} color={isAvatar ? '#3498db' : '#fff'} />
								{/* <Ionicons name='person-circle-outline' size={28} color='white' /> */}
							</Pressable>
						)}
					</Row>
					<Pressable onPress={onClose}>
						<Ionicons name='close-sharp' size={28} color='white' />
					</Pressable>
				</View>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<AutoSizeImage
						image={image}
						resizeMode='contain'
                        style={{ width: displayWidth, height: displayHeight }}
					/>
				</View>
                
                <Column spacing={Size.S} style={styles.footer}>
                    <Row paddingHorizontal={Size.M} spacing={8}>
                        <Text style={[styles.bottomButton, { color: '#fff' }]}>
                            {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                        </Text>
        
                        <Pressable onPress={handleToggleLike}>
                            <Text style={[styles.bottomButton, { color: liked ? 'red' : '#fff' }]}>
                                {liked ? '♥' : '♡'}
                            </Text>
                        </Pressable>
        
                        {commentCount > 0 && (
                            <Pressable
                                onPress={handleToggleComments}
                                style={{ paddingHorizontal: Size.M }}
                            >
                                <Text style={[styles.bottomButton, { color: '#fff' }]}>
                                    {expanded && 'Hide '}{commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                                </Text>
                            </Pressable>
                        )}
        
                        <Pressable onPress={handleAddComment}>
                            <Text style={styles.bottomButton}>Add Comment</Text>
                        </Pressable>
                    </Row>
                    {expanded && <ImageComments key={commentRefreshToken} refId={image.id} />}
                </Column>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
    fullscreenContainer: {
        // flex: 1,
        // position: 'relative',
        backgroundColor: '#000',
    },
    imageContainer: {
        flex: 1,
        // position: 'absolute',
        // top: 0, left: 0, right: 0, bottom: 0,
        // zIndex: 10,
        position: 'relative',
        // backgroundColor: 'pink',
    },
    header: {
        // paddingVertical: Size.S,
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
    footer: {
        paddingVertical: Size.S,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // height: 50,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        maxHeight: 200,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between',
    },
    comments: {
        // flex: 1,
        backgroundColor: 'yellow',
    },
    bottomButton: {
		fontSize: 16,
        color: '#fff',
	},
})

export default FullScreenImage
