// apps/web/src/components/PostListItem.tsx

import React, { useRef, useState } from 'react'
import { Text } from 'react-native'
import { Avatar, Column, Row, LikeCommentBar, PostComments, LinkPreview, AddCommentForm, IconButton, AutoSizeImage } from '@/components'
import { PartialUser, Post } from '@iam/types'
import { Size } from '@/styles'
import Autolink from 'react-native-autolink'
import Ionicons from '@expo/vector-icons/Ionicons'
import { formatRelative } from 'date-fns'
import { togglePostLike } from '@services'
import { useAuth, useModal, usePosts } from '@/hooks'

type Props = {
	post: Post
	showPreview: boolean
	commentCount: number
	onPostDeleted?: (postId: string) => void
	onCommentDeleted?: () => void
}

export const PostListItem: React.FC<Props> = ({
	post,
	showPreview,
	commentCount,
	onPostDeleted,
	onCommentDeleted,
}) => {
	const [liked, setLiked] = useState(post.likedByCurrentUser)
	const [likeCount, setLikeCount] = useState(post.likes.length)
	const [expanded, setExpanded] = useState(false)

	const { user, isAuthenticated } = useAuth()
	const { showModal } = useModal()
	const { deletePost, refreshCommentCounts } = usePosts()

	const postCommentsRef = useRef<{ handleNewComment?: (c: Comment) => void }>(null)
	const isAuthor = user?.id === post.author._id

	const handleToggleLike = async () => {
		try {
			await togglePostLike(post._id)
			setLiked((prev) => !prev)
			setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
		} catch (err) {
			console.error('Failed to toggle like:', err)
		}
	}

	const handleAddComment = () => {
		showModal(
			<AddCommentForm
				id={post._id}
				type='Post'
				onCommentAdded={(newComment) => {
					setExpanded(true)
					refreshCommentCounts([post])
					postCommentsRef.current?.handleNewComment?.(newComment)
				}}
			/>
		)
	}

	const handleDelete = async () => {
		await deletePost(post._id)
		onPostDeleted?.(post._id)
	}

	const renderHeader = () => (
		<Row spacing={Size.M} paddingHorizontal={Size.M} align='center'>
			<Avatar user={post.author as PartialUser} size='md' />
			<Column flex={1}>
				<Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 22 }}>
					{post.author.username}
				</Text>
				<Text style={{ fontSize: 14, lineHeight: 16 }}>
					{formatRelative(new Date(post.createdAt), new Date())}
				</Text>
			</Column>
			{isAuthor && (
				<IconButton
					onPress={handleDelete}
					icon={<Ionicons name='trash-bin' size={24} color='black' />}
				/>
			)}
		</Row>
	)

	return (
		<Column flex={1} spacing={Size.M} paddingBottom={Size.L}>
			{renderHeader()}
            
			<Autolink
				text={post.content}
				style={{ paddingHorizontal: Size.M, fontSize: 16, color: '#333' }}
				linkStyle={{ color: '#007aff' }}
				url
				email={false}
				phone={false}
				truncate={50}
				truncateChars='...'
			/>

			{post.image && <AutoSizeImage image={post.image} />}

			{showPreview && post.linkUrl && post.linkPreview && (
				<LinkPreview url={post.linkUrl} preview={post.linkPreview} />
			)}

			<LikeCommentBar
				likeCount={likeCount}
				liked={liked}
				commentCount={commentCount}
				isAuthenticated={isAuthenticated}
				onToggleLike={handleToggleLike}
				onToggleComments={() => setExpanded((prev) => !prev)}
				onAddComment={handleAddComment}
				textColor={isAuthenticated ? '#000' : '#ccc'}
			/>

			{expanded && (
				<PostComments
					refId={post._id}
					ref={postCommentsRef}
					onCommentDeleted={onCommentDeleted}
				/>
			)}
		</Column>
	)
}
