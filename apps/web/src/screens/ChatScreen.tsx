// apps/web/src/screens/ChatScreen.tsx

import React, { useState, useEffect } from 'react'
import { View, TextInput, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000', {
	withCredentials: true,
	transports: ['websocket'],
})

export const ChatScreen = () => {
	
	const [messages, setMessages] = useState<any[]>([])
	const [input, setInput] = useState('')

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

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<Text style={styles.heading}>Live Chat</Text>
			<ScrollView style={styles.messages} contentContainerStyle={{ padding: 10 }}>
				{messages.map((msg, idx) => (
					<Text key={idx} style={styles.message}>
    			        {msg.text}
          			</Text>
				))}
			</ScrollView>
			<TextInput
				value={input}
				onChangeText={setInput}
				onSubmitEditing={sendMessage}
				placeholder='Type a message...'
				style={styles.input}
				returnKeyType='send'
			/>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#f4f4f4',
	},
	heading: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	messages: {
		flex: 1,
		backgroundColor: '#fff',
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
	},
})