// apps/web/src/screens/ChatScreen.tsx

import React, { useRef, useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import { ChatInput, ChatList, Column } from '@/components'
import { useAuth, useSocket } from '@/hooks'
import { resolveResponsiveProp } from '@iam/theme'

export const ChatScreen = () => {
	const { user } = useAuth()
	const { onChatMessage, emitChatMessage } = useSocket()
	const [messages, setMessages] = useState<any[]>([])
	const scrollViewRef = useRef<ScrollView>(null)
    const paddingVertical = resolveResponsiveProp({ xs: 4, sm: 8, md: 16, lg: 24 })

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
        <Column flex={1} spacing={10} paddingVertical={paddingVertical}>
            <ChatList messages={messages} />
            <ChatInput onSend={sendMessage} />
        </Column>
	)
}