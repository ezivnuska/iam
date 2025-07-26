// apps/web/src/features/chat/components/ChatList.tsx

import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { AutoScrollView } from '@shared/scrolling'
import { Avatar } from '@shared/ui'
import { Column, Row } from '@shared/grid'
import { Size, withAlpha } from '@iam/theme'
import { useTheme } from '@shared/hooks'
import type { ChatMessage } from '@iam/types'

type ChatListProps = {
    messages: ChatMessage[]
}

export const ChatList = ({ messages }: ChatListProps) => {
    const { theme } = useTheme()
    return (
        <AutoScrollView dependencies={[messages]} style={{ borderWidth: 1, borderRadius: 8, borderColor: theme.colors.muted, backgroundColor: withAlpha(theme.colors.muted, 0.1) }}>
            <Column spacing={Size.XS}>
                {messages.map((item, index) => {
                    const showAvatar =
                        index === 0 || messages[index - 1]?.user?.id !== item.user.id
                    return (
                        <Row key={index}>
                            <View style={{ width: 40 }}>
                                {showAvatar && <Avatar user={item.user} size='xs' />}
                            </View>
                            <Text
                                style={[
                                    styles.message,
                                    { color: theme.colors.text },
                                ]}
                            >
                                {item.text}
                            </Text>
                        </Row>
                    )
                })}
            </Column>
        </AutoScrollView>
    )
}

const styles = StyleSheet.create({
	message: {
        flex: 1,
		paddingVertical: 4,
		fontSize: 14,
        lineHeight: 20,
        color: '#fff',
	},
})