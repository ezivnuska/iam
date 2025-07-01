// apps/web/src/components/PostListItem.tsx

import React, { useRef, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { Avatar, Column, Row, LikeCommentBar, PostComments, LinkPreview, IconButton, AutoSizeImage } from '@/components'
import { CommentForm } from '@/forms'
import { Comment, PartialUser, Post } from '@iam/types'
import { paddingHorizontal, Size } from '@/styles'
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
	const { openFormModal } = useModal()
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
		openFormModal(CommentForm, {
            id: post._id,
            type: 'Post',
            onCommentAdded: (newComment: Comment) => {
                setExpanded(true)
                refreshCommentCounts([post])
                postCommentsRef.current?.handleNewComment?.(newComment)
            },
		}, { title: 'Add Comment' })
	}

	const handleDelete = async () => {
		await deletePost(post._id)
		onPostDeleted?.(post._id)
	}

	const renderHeader = () => (
		<Row spacing={Size.M} paddingHorizontal={paddingHorizontal} align='center'>
			<Avatar user={post.author as PartialUser} size='md' />
			<Column flex={1}>
				<Text style={styles.username}>
					{post.author.username}
				</Text>
				<Text style={styles.date}>
					{formatRelative(new Date(post.createdAt), new Date())}
				</Text>
			</Column>
			{isAuthor && (
				<IconButton
					onPress={handleDelete}
					icon={<Ionicons name='trash-outline' size={24} color='#fff' />}
				/>
			)}
		</Row>
	)

	return (
		<Column spacing={Size.M} paddingVertical={Size.S}>
			{renderHeader()}
            
			<Autolink
				text={post.content}
				style={{ paddingHorizontal: paddingHorizontal, fontSize: 16, color: '#eee' }}
				linkStyle={{ color: '#0ff' }}
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
				textColor={isAuthenticated ? '#eee' : '#aaa'}
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

const styles = StyleSheet.create({
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 22,
        color: '#fff',
    },
    date: {
        fontSize: 14,
        lineHeight: 16,
        color: '#ccc',
    },
})