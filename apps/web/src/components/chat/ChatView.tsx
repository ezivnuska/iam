// apps/web/src/components/chat/ChatView.tsx

import React, { useRef, useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { ChatInput, ChatList, Column } from '@/components'
import { useAuth, useSocket, useTheme } from '@/hooks'
import { Size } from '@iam/theme'

export const ChatView = () => {
	const { user } = useAuth()
	const { onChatMessage, emitChatMessage } = useSocket()
	const { theme } = useTheme()
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
        <Column flex={1} spacing={10} paddingBottom={Size.S} style={{ backgroundColor: theme.colors.background }}>
            <ChatList messages={messages} />
            <ChatInput onSend={sendMessage} />
        </Column>
	)
}