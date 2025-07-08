// apps/web/src/screens/ChatScreen.tsx

import React, { useRef, useState, useEffect } from 'react'
import { Text, ScrollView, StyleSheet, View } from 'react-native'
import { AutoScrollView, Avatar, ChatInput, Column, PageLayout, Row } from '@/components'
import { paddingHorizontal, Size } from '@/styles'
import { useAuth, useSocket } from '@/hooks'

export const ChatScreen = () => {
	const { user } = useAuth()
	const { onChatMessage, emitChatMessage } = useSocket()
	const [messages, setMessages] = useState<any[]>([])
	const scrollViewRef = useRef<ScrollView>(null)

	useEffect(() => {
		const cleanup = onChatMessage((msg) => {
			setMessages((prev) => [...prev, msg])
		})
		return () => cleanup()
	}, [onChatMessage])

	useEffect(() => {
		scrollViewRef.current?.scrollToEnd({ animated: true })
	}, [messages])

	const sendMessage = (text: string) => {
		if (!text.trim()) return

		const author = {
			id: user?.id,
			role: user?.role,
			username: user?.username,
			avatar: user?.avatar,
		}

		setMessages((prev) => [...prev, { _id: Date.now(), text, user: author }])
		emitChatMessage(text)
	}

	return (
		<PageLayout>
			<View style={{ flex: 1 }}>
				{/* <View style={{ flex: 1 }}> */}
					<AutoScrollView dependencies={[messages]}>
                        <Column spacing={Size.XS}>
                            {messages.map((item, index) => {
                                const showAvatar =
                                    index === 0 || messages[index - 1]?.user?.id !== item.user.id
                                return (
                                    <Row key={item._id}>
                                        <View style={{ width: 40 }}>
                                            {showAvatar && <Avatar user={item.user} size='xs' />}
                                        </View>
                                        <Text style={styles.message}>{item.text}</Text>
                                    </Row>
                                )
                            })}
                        </Column>
					</AutoScrollView>
                
                <View style={{ paddingHorizontal }}>
                    <ChatInput onSend={sendMessage} />
                </View>
			</View>
		</PageLayout>
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