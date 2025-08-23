// apps/web/src/features/memory/components/MemoryList.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { MemoryListItem } from '.'
import { InfiniteScrollView } from '@shared/scrolling'
import { Column } from '@shared/grid'
import { useMemory } from '../hooks'
import { useTheme } from '@shared/hooks'

const PAGE_SIZE = 5

export const MemoryList = () => {
	const { memories, isRefreshing, isMutating } = useMemory()
	const { theme } = useTheme()

	const [visibleMemories, setVisibleMemories] = useState(memories.slice(0, PAGE_SIZE))

	useEffect(() => {
		setVisibleMemories(memories.slice(0, PAGE_SIZE))
	}, [memories])

	const loadMoreMemories = useCallback(() => {
		setVisibleMemories(prev => {
			const next = memories.slice(0, prev.length + PAGE_SIZE)
			return next.length > prev.length ? next : prev
		})
	}, [memories, visibleMemories.length])

	const hasMore = visibleMemories.length < memories.length

	return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <InfiniteScrollView onScrollNearBottom={hasMore ? loadMoreMemories : undefined}>
                <Column>
                    {visibleMemories.map((memory) => (
                        <View key={memory.id}>
                            <MemoryListItem
                                memory={memory}
                                // showPreview={!!memory.linkPreview}
                            />
                        </View>
                    ))}
                </Column>
                {(isRefreshing || isMutating) && (
                    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <ActivityIndicator size='small' />
                    </View>
                )}
            </InfiniteScrollView>
        </View>
	)
}
