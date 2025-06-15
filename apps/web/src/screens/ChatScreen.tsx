// apps/web/src/screens/ChatScreen.tsx

import React, { KeyboardEvent, useRef, useState, useEffect } from 'react'
import { Platform, TextInput, TextInput as RNTextInput, Text, StyleSheet, FlatList, TouchableOpacity, View } from 'react-native'
import { Column, Avatar, PageLayout, Row } from '@/components'
import { horizontalPadding, Size } from '@/styles'
import { useSocket } from '@/hooks'

export const ChatScreen = () => {
	
	const [messages, setMessages] = useState<any[]>([])
	const [input, setInput] = useState('')
    const inputRef = useRef<RNTextInput>(null)

    const { onChatMessage, emitChatMessage } = useSocket()

    useEffect(() => {
		inputRef.current?.focus()
	}, [])

    useEffect(() => {
		const cleanup = onChatMessage((msg) => {
			setMessages(prev => [...prev, msg])
		})
		return () => cleanup()
	}, [onChatMessage])

	const sendMessage = () => {
		if (input.trim()) {
			emitChatMessage(input)
			setInput('')
            inputRef.current?.focus()
		}
	}

	return (
        <PageLayout>
            <Column flex={1} style={horizontalPadding}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        const showAvatar =
                            index === 0 || messages[index - 1]?.user?.id !== item.user.id
                
                        return (
                            <Row paddingBottom={Size.XS}>
                                <View style={{ width: 40 }}>
                                    {showAvatar && <Avatar user={item.user} size='xs' />}
                                </View>
                                <Text style={styles.message}>{item.text}</Text>
                            </Row>
                        )
                    }}
                />
                <Row style={{ alignItems: 'center' }}>
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder='Say something...'
                        style={[styles.input, { flex: 1 }]}
                        returnKeyType='send'
                        onSubmitEditing={sendMessage}
                        ref={inputRef}
                    />

                    <TouchableOpacity onPress={sendMessage}>
                        <Text style={styles.sendButton}>Send</Text>
                    </TouchableOpacity>
                </Row>
            </Column>
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
    sendButton: {
        marginLeft: 8,
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 16,
    },    
})