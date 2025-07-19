// apps/web/src/screens/ChatScreen.tsx

import React, { useRef, useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { ChatInput, ChatList, Column, Screen } from '@/components'
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
        <Screen>
            <Column flex={1} spacing={10}>
                <ChatList messages={messages} />
                <ChatInput onSend={sendMessage} />
            </Column>
        </Screen>
	)
}