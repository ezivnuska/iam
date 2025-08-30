// apps/web/src/features/memory/components/MemoryListItem.tsx

import React from 'react'
import { AutoSizeImage } from '@shared/ui'
import { MemoryForm, MemoryListItemHeader } from '.'
import { FeedbackBarContainer } from '@shared/feedback'
import { Column, Row } from '@shared/grid'
import type { Memory } from '@iam/types'
import { RefType } from '@iam/types'
import { Size } from '@iam/theme'
import { useMemory } from '../hooks'
import { useAuth } from '@features/auth'
import { useModal, useTheme } from '@shared/hooks'
import { navigate } from '@shared/navigation'
import { StyleSheet, Text, View } from 'react-native'
import { formatDate } from 'date-fns'
import { IconButton } from '@shared/buttons'
import { ModalContainer } from '@shared/modals'

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
	const { hideModal, showModal } = useModal()
	const { deleteMemory, deleteMemoryImage, updateMemory } = useMemory()
	const { theme } = useTheme()

	const author = memory.author
	const owned = user?.id === author.id

	const handleDelete = async () => {
		await deleteMemory(memory.id)
		onMemoryDeleted?.(memory.id)
	}

    const editMemory = () => {
        showModal((
            <ModalContainer
                title='Add or Update Memory'
                onDismiss={hideModal}
            >
                <MemoryForm memory={memory} />
            </ModalContainer>
        ), true)
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
			<MemoryListItemHeader
                author={author}
                date={memory.createdAt}
                owned={owned}
                navigateToUser={handleUserPress}
                deleteMemory={handleDelete}
            />

            <Row spacing={12} justify='space-between'>
                <Text style={[styles.text, { color: theme.colors.text }]}>{formatDate(new Date(memory.date), 'MMMM do y')}</Text>
                {owned && <IconButton onPress={editMemory} iconName='create' />}
            </Row>
            <Text style={[styles.text, { color: theme.colors.text }]}>{memory.content}</Text>

			{memory.image && (
                <View style={{ flex: 1, position: 'relative' }}>
                    <View style={{ flex: 1, zIndex: 10 }}>
                        <AutoSizeImage image={memory.image} />
                    </View>
                    {owned && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                zIndex: 100,
                            }}
                        >
                            <Row
                                align='center'
                                justify='center'
                                style={{
                                    backgroundColor: '#000',
                                    borderRadius: 24,
                                    height: 36,
                                    width: 36,
                                    alignContent: 'center',
                                }}
                            >
                                <IconButton onPress={() => deleteMemoryImage(memory.id)} iconName='close' iconSize={30} />
                            </Row>
                        </View>
                    )}
                </View>
            )}

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