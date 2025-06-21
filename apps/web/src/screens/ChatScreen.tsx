// apps/web/src/screens/ChatScreen.tsx

import React, { KeyboardEvent, useRef, useState, useEffect } from 'react'
import { TextInput, TextInput as RNTextInput, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity, View } from 'react-native'
import { AutoScrollView, Column, Avatar, PageLayout, Row, InfiniteScrollView } from '@/components'
import { paddingHorizontal, paddingVertical, Size } from '@/styles'
import { useAuth, useSocket } from '@/hooks'
import Feather from '@expo/vector-icons/Feather'

export const ChatScreen = () => {
	const { user } = useAuth()
	const [messages, setMessages] = useState<any[]>([])
	const [input, setInput] = useState('')
	const inputRef = useRef<RNTextInput>(null)
	const scrollViewRef = useRef<ScrollView>(null)

	const { onChatMessage, emitChatMessage } = useSocket()

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	useEffect(() => {
		const cleanup = onChatMessage((msg) => {
			setMessages((prev) => [...prev, msg])
		})
		return () => cleanup()
	}, [onChatMessage])

	useEffect(() => {
		scrollViewRef.current?.scrollToEnd({ animated: true })
	}, [messages])

	const sendMessage = () => {
		if (input.trim()) {
			const author = {
				id: user?.id,
				role: user?.role,
				username: user?.username,
				avatar: user?.avatar,
			}
			setMessages((prev) => [...prev, { _id: Date.now(), text: input, user: author }])
			emitChatMessage(input)
			setInput('')
			inputRef.current?.focus()
		}
	}

	return (
		<PageLayout>
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<AutoScrollView dependencies={[messages]}>
						{messages.map((item, index) => {
							const showAvatar =
								index === 0 || messages[index - 1]?.user?.id !== item.user.id
							return (
								<View key={item._id}>
									<Row paddingBottom={Size.XS}>
										<View style={{ width: 40 }}>
											{showAvatar && <Avatar user={item.user} size='xs' />}
										</View>
										<Text style={styles.message}>{item.text}</Text>
									</Row>
								</View>
							)
						})}
					</AutoScrollView>
				</View>

				{/* Fixed Input at Bottom */}
				<Row align='center' spacing={Size.S} style={styles.inputRow}>
					<TextInput
						value={input}
						onChangeText={setInput}
						placeholder='Say something...'
						placeholderTextColor='#ccc'
						style={styles.input}
						returnKeyType='send'
						onSubmitEditing={sendMessage}
						ref={inputRef}
						onFocus={() => {
							setTimeout(() => {
								scrollViewRef.current?.scrollToEnd({ animated: true })
							}, 100)
						}}
					/>
					<TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
						<Feather name='arrow-right' size={30} color='#fff' />
					</TouchableOpacity>
				</Row>
			</View>
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
	messageList: {
		flexGrow: 1,
	},
	inputRow: {
		paddingVertical,
		paddingHorizontal,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderColor: '#eee',
	},	
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		paddingHorizontal: 12,
		backgroundColor: '#fff',
		lineHeight: 40,
		fontSize: 20,
	},
	sendButton: {
		backgroundColor: '#3a3',
		height: 40,
		width: 40,
		borderRadius: 20,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
})