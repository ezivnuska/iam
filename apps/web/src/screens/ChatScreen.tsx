// apps/web/src/screens/ChatScreen.tsx

import React, { useRef, useState, useEffect } from 'react'
import { TextInput, TextInput as RNTextInput, Text, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Column, PageLayout } from '@/components'
import { horizontalPadding } from '@/styles'
import { useSocket } from '@/hooks'

export const ChatScreen = () => {
	
	const [messages, setMessages] = useState<any[]>([])
	const [input, setInput] = useState('')
    const inputRef = useRef<RNTextInput>(null)

    const { onChatMessage, emitChatMessage } = useSocket()

    useEffect(() => {
		const cleanup = onChatMessage((msg) => {
			setMessages(prev => [...prev, msg])
		})
		return cleanup
	}, [onChatMessage])

	const sendMessage = () => {
		if (input.trim()) {
			emitChatMessage(input)
			setInput('')
		}
	}

	return (
        <PageLayout>
            <Column flex={1} style={horizontalPadding}>
                <KeyboardAwareScrollView
                    style={styles.container}
                    enableOnAndroid={true}
                    extraScrollHeight={100}
                    keyboardShouldPersistTaps='handled'
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
					onFocus={() => inputRef.current?.focus()}
                    ref={inputRef}
                />
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
})