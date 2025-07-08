// apps/web/src/components/chat/ChatList.tsx

import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { AutoScrollView, Avatar, Column, Row } from '@/components'
import { Size } from '@/styles'
import type { ChatMessage } from '@iam/types'

type ChatListProps = {
    messages: ChatMessage[]
}

export const ChatList = ({ messages }: ChatListProps) => {
    return (
        <AutoScrollView dependencies={[messages]}>
            <Column spacing={Size.XS}>
                {messages.map((item, index) => {
                    const showAvatar =
                        index === 0 || messages[index - 1]?.user?.id !== item.user.id
                    return (
                        <Row key={index}>
                            <View style={{ width: 40 }}>
                                {showAvatar && <Avatar user={item.user} size='xs' />}
                            </View>
                            <Text style={styles.message}>{item.text}</Text>
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