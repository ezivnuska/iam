// apps/web/src/components/CommentsSection.tsx

// apps/web/src/components/CommentsSection.tsx

import React from 'react'
import { Text, View, FlatList } from 'react-native'
import type { Comment } from '@iam/types'

type CommentSectionProps = {
	comments: Comment[]
}

export const CommentSection = ({ comments }: CommentSectionProps) => {
	return (
		<View>
			<FlatList
				data={comments}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => (
					<View style={{ padding: 5 }}>
						<Text style={{ fontWeight: 'bold' }}>{item.author.username}</Text>
						<Text>{item.content}</Text>
					</View>
				)}
			/>
		</View>
	)
}
