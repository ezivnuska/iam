// apps/web/src/features/feed/components/FeedListItemHeader.tsx

import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { Avatar } from '@shared/ui'
import { IconButton } from '@shared/buttons'
import { Column, Row } from '@shared/grid'
import type { PartialUser } from '@iam/types'
import { resolveResponsiveProp, Size } from '@iam/theme'
import { formatRelative } from 'date-fns'
import { useAuth } from '@features/auth'
import { useTheme } from '@shared/hooks'

type Props = {
	author: PartialUser
    date: string
    owned: boolean
    deleteMemory: () => void
    navigateToUser: () => void
}

export const MemoryListItemHeader: React.FC<Props> = ({
    author,
    date,
    owned,
    navigateToUser,
    deleteMemory,
}) => {
	const { isAuthenticated } = useAuth()
	const { theme } = useTheme()

    const iconSize = resolveResponsiveProp({ xs: 24, sm: 24, md: 24, lg: 24 })

	return (
        <Row spacing={Size.M} align='center' justify='space-between'>
            
            <Pressable onPress={navigateToUser} disabled={!isAuthenticated}>
                <Row spacing={Size.M} align='center'>
                    <Avatar user={author as PartialUser} size='md' />
                    <Column flex={1}>
                        <Text style={[styles.username, { color: theme.colors.text }]}>
                            {author.username}
                        </Text>
                        <Text style={[ styles.date, { color: theme.colors.textSecondary }]}>
                            {formatRelative(new Date(date), new Date())}
                        </Text>
                    </Column>
                </Row>
            </Pressable>

            {isAuthenticated && owned && (
                <IconButton
                    onPress={deleteMemory}
                    iconName='trash-outline'
                    iconSize={iconSize}
                />
            )}
            
        </Row>
	)
}

const styles = StyleSheet.create({
	username: {
		fontSize: 20,
		fontWeight: 'bold',
		lineHeight: 22,
	},
	date: {
		fontSize: 14,
		lineHeight: 16,
	},
})
