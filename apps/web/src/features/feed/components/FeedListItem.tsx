// apps/web/src/features/feed/components/FeedListItem.tsx

import React from 'react'
import { AutoSizeImage } from '@shared/ui'
import { FeedListItemHeader, LinkPreview } from './'
import { FeedbackBarContainer } from '@shared/feedback'
import { Column } from '@shared/grid'
import type { Post } from '@iam/types'
import { RefType } from '@iam/types'
import { Size } from '@iam/theme'
import Autolink from 'react-native-autolink'
import { usePosts } from '../hooks'
import { useAuth, useTheme } from '@shared/hooks'
import { navigate } from '@shared/navigation'

type Props = {
	post: Post
	showPreview: boolean
	onPostDeleted?: (postId: string) => void
	onCommentDeleted?: () => void
}

export const FeedListItem: React.FC<Props> = ({
	post,
	showPreview,
	onPostDeleted,
	onCommentDeleted,
}) => {
	const { user } = useAuth()
	const { deletePost } = usePosts()
	const { theme } = useTheme()

	const author = post.author
	const owned = user?.id === author.id

	const handleDelete = async () => {
		await deletePost(post.id)
		onPostDeleted?.(post.id)
	}
    
    const handleUserPress = () => {
        if (owned) {
            navigate('Profile')
        } else {
            navigate('Users', {
                screen: 'User',
                params: { username: author.username as string },
            })
        }
    }

	return (
		<Column
            spacing={Size.M} 
            style={{ marginBottom: Size.M }}
        >
			<FeedListItemHeader
                author={author}
                date={post.createdAt}
                owned={owned}
                navigateToUser={handleUserPress}
                deletePost={handleDelete}
            />

			<Autolink
				text={post.content}
				style={{ fontSize: 16, color: theme.colors.text }}
				linkStyle={{ color: theme.colors.link }}
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

            <FeedbackBarContainer
                refId={post.id}
                refType={RefType.Post}
                onCommentDeleted={onCommentDeleted}
            />
		</Column>
	)
}
