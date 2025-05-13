// apps/web/src/screens/ChatScreen.tsx

import React, { useRef, useState, useEffect } from 'react'
import { TextInput, TextInput as RNTextInput, Text, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PageHeader, PageLayout } from '@/components'
import { io } from 'socket.io-client'

const socket = io(process.env.SOCKET_URL, {
    path: '/socket.io',
    withCredentials: true,
    transports: ['websocket'],
})

export const ChatScreen = () => {
	
	const [messages, setMessages] = useState<any[]>([])
	const [input, setInput] = useState('')

    const inputRef = useRef<RNTextInput>(null)

	useEffect(() => {
		socket.on('chat:message', (msg) => {
			// assuming msg is an object { id, text, timestamp }
			setMessages(prev => [...prev, msg])
		})

		return () => {
			socket.off('chat:message')
		}
	}, [])

	const sendMessage = () => {
		if (input.trim()) {
			socket.emit('chat:message', input)
			setInput('')
		}
	}

    const scrollToInput = (ref: React.RefObject<any>) => {
        ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

	return (
        <PageLayout>
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid={true}
                extraScrollHeight={100}
                keyboardShouldPersistTaps="handled"
            >
                {messages.map((msg, idx) => (
                    <Text key={idx} style={styles.message}>
                        {msg.text}
                    </Text>
                ))}
            </KeyboardAwareScrollView>
            <TextInput
                value={input}
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
                placeholder='Say something...'
                style={styles.input}
                returnKeyType='send'
                onFocus={() => scrollToInput(inputRef)}
                ref={inputRef}
            />
        </PageLayout>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        paddingVertical: 10,
	},
	heading: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	messages: {
		flex: 1,
		backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
		borderRadius: 8,
		marginBottom: 12,
	},
	message: {
		paddingVertical: 4,
		fontSize: 14,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: '#fff',
        marginBottom: 10,
	},
})