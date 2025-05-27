// apps/web/src/components/PostListItem.tsx

import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Column, Row, ProfileImage, CommentSection, QueuedLinkPreview, AddCommentForm } from '@/components'
import { PartialUser, Post } from '@iam/types'
import { Size } from '@/styles'
import Autolink from 'react-native-autolink'
import Ionicons from '@expo/vector-icons/Ionicons'
import { formatRelative } from 'date-fns'
import { fetchCommentSummary, toggleLike } from '@services'
import { useAuth, useModal, useLinkPreviewQueue, usePosts } from '@/hooks'
import { extractFirstUrl } from '@/utils'

type Props = {
	post: Post
	firstUrl: string | null
	shouldRender: (postId: string) => boolean
	enqueue: (postId: string, url: string, callback: () => void) => void
	onPostDeleted?: (postId: string) => void
}

export const PostListItem: React.FC<Props> = ({ post, firstUrl, enqueue, shouldRender, onPostDeleted }) => {
	const { user, isAuthenticated } = useAuth()
	const { showModal } = useModal()
	const { deletePost } = usePosts()

	const isAuthor = user?.id === post.author._id

	const [liked, setLiked] = useState(post.likedByCurrentUser)
	const [likeCount, setLikeCount] = useState(post.likes.length)
	const [commentCount, setCommentCount] = useState(0)
	const [expanded, setExpanded] = useState(false)

	useEffect(() => {
		const fetch = async () => {
			try {
				const summary = await fetchCommentSummary(post._id)
				setCommentCount(summary.count)
			} catch (err) {
				console.error('Failed to load comment count:', err)
			}
		}
		fetch()
	}, [post._id])

	const handleToggleLike = async () => {
		try {
			await toggleLike(post._id)
			setLiked((prev) => !prev)
			setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
		} catch (err) {
			console.error('Failed to toggle like:', err)
		}
	}

	const handleToggleComments = () => {
		setExpanded((prev) => !prev)
	}

	const handleAddComment = () => {
		showModal(<AddCommentForm postId={post._id} onCommentAdded={() => setExpanded(true)} />)
	}

	const handleDelete = async () => {
		await deletePost(post._id)
		onPostDeleted?.(post._id)
	}

	const renderHeader = (item: Post) => (
		<Row spacing={16} paddingHorizontal={Size.M} align='center'>
			<ProfileImage user={item.author as PartialUser} size='md' />
			<Column flex={1}>
				<Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 22 }}>
					{item.author.username}
				</Text>
				<Text style={{ fontSize: 14, lineHeight: 16 }}>
					{formatRelative(new Date(item.createdAt), new Date())}
				</Text>
			</Column>
			{isAuthor && (
				<Pressable onPress={handleDelete} style={{ alignSelf: 'flex-start' }}>
					<Ionicons name='close-sharp' size={24} color='black' />
				</Pressable>
			)}
		</Row>
	)

	const bottomButtonColor = isAuthenticated ? '#000' : '#ccc'

	return (
		<Column flex={1} spacing={Size.M} paddingBottom={Size.L}>
			{renderHeader(post)}

			<Autolink
				text={post.content}
				linkStyle={{ color: '#007aff' }}
				url
				email={false}
				phone={false}
				truncate={50}
				truncateChars="..."
				style={{ paddingHorizontal: Size.M }}
			/>

			{firstUrl && shouldRender(post._id) && (
				<QueuedLinkPreview
					id={post._id}
					url={firstUrl}
					enqueue={enqueue}
					shouldRender={shouldRender}
				/>
			)}

			<Row paddingHorizontal={Size.M} spacing={8}>
				<Text style={[styles.bottomButton, { color: bottomButtonColor }]}>
					{likeCount} {likeCount === 1 ? 'like' : 'likes'}
				</Text>

				{isAuthenticated && (
					<Pressable onPress={handleToggleLike}>
						<Text style={[styles.bottomButton, { color: liked ? 'red' : 'gray' }]}>
							{liked ? '♥' : '♡'}
						</Text>
					</Pressable>
				)}

				<Pressable
					onPress={handleToggleComments}
					style={{ paddingHorizontal: Size.M }}
					disabled={!isAuthenticated || !commentCount}
				>
					<Text style={[styles.bottomButton, { color: bottomButtonColor }]}>
						{commentCount} {commentCount === 1 ? 'comment' : 'comments'}
					</Text>
				</Pressable>

				{isAuthenticated && (
					<Pressable onPress={handleAddComment}>
						<Text style={styles.bottomButton}>Add Comment</Text>
					</Pressable>
				)}
			</Row>

			{expanded && <CommentSection postId={post._id} />}
		</Column>
	)
}

const styles = StyleSheet.create({
	bottomButton: {
		fontSize: 16,
	},
})
