// apps/web/src/features/feed/components/MemoryListItem.tsx

import React, { useMemo } from 'react'
import { AutoSizeImage } from '@shared/ui'
import { MemoryListItemHeader } from '.'
import { FeedbackBarContainer } from '@shared/feedback'
import { Column, Row } from '@shared/grid'
import type { Memory, Post } from '@iam/types'
import { RefType } from '@iam/types'
import { Size } from '@iam/theme'
import { useMemory } from '../hooks'
import { useAuth, useModal, useTheme } from '@shared/hooks'
import { navigate } from '@shared/navigation'
import { StyleSheet, Text } from 'react-native'
import { formatDate } from 'date-fns'
import { MemoryForm } from '@shared/forms'
import { IconButton } from '@shared/buttons'

type Props = {
	memory: Memory
	onMemoryDeleted?: (memoryId: string) => void
	onCommentDeleted?: () => void
}

export const MemoryListItem: React.FC<Props> = ({
	memory,
	onMemoryDeleted,
	onCommentDeleted,
}) => {
	const { user } = useAuth()
	const { deleteMemory, deleteMemoryImage, updateMemory } = useMemory()
    const { hideModal, openFormModal } = useModal()
	const { theme } = useTheme()

	const author = memory.author
	const owned = user?.id === author.id
    
    const onMemoryUpdated = (memory: Memory) => {
        updateMemory(memory)
        hideModal()
    }

	const handleDelete = async () => {
		await deleteMemory(memory.id)
		onMemoryDeleted?.(memory.id)
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

    const showMemoryModal = () => {
        openFormModal(MemoryForm, { onComplete: onMemoryUpdated, memory }, { title: 'Edit Memory', fullscreen: true })
    }

	return (
		<Column
            spacing={Size.M} 
            style={{ marginBottom: Size.M }}
        >
			<MemoryListItemHeader
                author={author}
                date={memory.createdAt}
                owned={owned}
                navigateToUser={handleUserPress}
                deleteMemory={handleDelete}
            />

            <Row spacing={12} justify='space-between'>
                <Text style={[styles.text, { color: theme.colors.text }]}>{formatDate(new Date(memory.date), 'MMMM do y')}</Text>
                <IconButton onPress={showMemoryModal} iconName='create' />
            </Row>
            <Text style={[styles.text, { color: theme.colors.text }]}>{memory.content}</Text>

			{/* {!post.linkUrl && (
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
            )} */}

			{memory.image && <AutoSizeImage image={memory.image} />}
			{memory.image && <IconButton onPress={() => deleteMemoryImage(memory.id)} iconName='close' />}

			{/* {showPreview && post.linkUrl && post.linkPreview && (
                <LinkPreview url={post.linkUrl} preview={post.linkPreview} />
			)} */}

            <FeedbackBarContainer
                refId={memory.id}
                refType={RefType.Memory}
                onCommentDeleted={onCommentDeleted}
            />
		</Column>
	)
}

const styles = StyleSheet.create({
    date: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
    }
})