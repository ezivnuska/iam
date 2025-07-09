// apps/web/src/components/PostListItem.tsx

import React, { useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import {
    AutoSizeImage,
    Avatar,
    Column,
    IconButton,
    LinkPreview,
    Row,
    LikeCommentBarContainer,
} from '@/components'
import type { PartialUser, Post } from '@iam/types'
import { paddingHorizontal, Size } from '@/styles'
import Autolink from 'react-native-autolink'
import Ionicons from '@expo/vector-icons/Ionicons'
import { formatRelative } from 'date-fns'
import { useAuth, usePosts } from '@/hooks'
import { normalizeUser } from '@utils'

type Props = {
	post: Post
	showPreview: boolean
	onPostDeleted?: (postId: string) => void
	onCommentDeleted?: () => void
}

export const PostListItem: React.FC<Props> = ({
	post,
	showPreview,
	onPostDeleted,
	onCommentDeleted,
}) => {
	const { user, isAuthenticated } = useAuth()
	const { deletePost } = usePosts()

	const author = normalizeUser(post.author)
	const isAuthor = user?.id === author.id

	const [expanded, setExpanded] = useState(false)

	const handleDelete = async () => {
		await deletePost(post._id)
		onPostDeleted?.(post._id)
	}

	const renderHeader = () => (
		<Row spacing={Size.M} paddingHorizontal={paddingHorizontal} align='center'>
			<Avatar user={post.author as PartialUser} size='md' />
			<Column flex={1}>
				<Text style={styles.username}>{post.author.username}</Text>
				<Text style={styles.date}>
					{formatRelative(new Date(post.createdAt), new Date())}
				</Text>
			</Column>
			{isAuthenticated && isAuthor && (
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
				style={{ paddingHorizontal, fontSize: 16, color: '#eee' }}
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

			<LikeCommentBarContainer
				refId={post._id}
				refType='Post'
				expanded={expanded}
				setExpanded={setExpanded}
				onCommentDeleted={onCommentDeleted}
				textColor={isAuthenticated ? '#eee' : '#aaa'}
				iconColor='#aaa'
			/>
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
