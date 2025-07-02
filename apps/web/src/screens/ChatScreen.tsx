// apps/web/src/screens/ChatScreen.tsx

import React, { useRef, useState, useEffect } from 'react'
import { TextInput, TextInput as RNTextInput, Text, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AutoScrollView, Avatar, PageLayout, Row } from '@/components'
import { paddingHorizontal, paddingVertical, Size, form as formStyles } from '@/styles'
import { useAuth, useSocket } from '@/hooks'
import Feather from '@expo/vector-icons/Feather'
import { useForm, Controller, FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
    input: z.string().min(1, 'Message is required').max(280),
})

type ChatFormProps = z.infer<typeof schema>

export const ChatScreen = () => {
	const { user } = useAuth()
	const [messages, setMessages] = useState<any[]>([])
    const [focused, setFocused] = useState<string | null>(null)
	const inputRef = useRef<RNTextInput>(null)
	const scrollViewRef = useRef<ScrollView>(null)
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue,
        getValues,
    } = useForm<ChatFormProps>({
        resolver: zodResolver(schema),
        mode: 'all',
        defaultValues: {
            input: '',
        },
    })

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

	const sendMessage = (text: string) => {
		if (text.trim()) {
			const author = {
				id: user?.id,
				role: user?.role,
				username: user?.username,
				avatar: user?.avatar,
			}
			setMessages((prev) => [...prev, { _id: Date.now(), text, user: author }])
			emitChatMessage(text)
			setValue('input', '')
			inputRef.current?.focus()
		}
	}

    const onSubmit = async (data: ChatFormProps) => {
		try {
			sendMessage(data.input)
		} catch (err: unknown) {
			const errorObj = err as {
				response?: {
					data?: {
						error?: {
							details?: unknown
						}
					}
				}
			}
		
			const details = errorObj.response?.data?.error?.details
		
			if (Array.isArray(details) && details.length === 2) {
				const [field, issue] = details
		
				if (typeof field === 'string' && typeof issue === 'string') {
					setError(field as keyof ChatFormProps, { message: issue }, { shouldFocus: true })
					return
				}
			}
		}
	}

    const focusFirstError = (formErrors: FieldErrors<ChatFormProps>) => {
        if (formErrors.input) {
            inputRef.current?.focus()
        }
    }

	const onInvalid = (errors: FieldErrors<ChatFormProps>) => {
        focusFirstError(errors)
    }

    const isFocused = (name: string) => focused === name

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

				<Row
                    align='center'
                    spacing={Size.S}
                >
                    <Controller
                        control={control}
                        name='input'
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                ref={inputRef}
                                autoFocus
                                placeholder='Say something...'
                                placeholderTextColor='#555'
                                value={value}
                                onChangeText={onChange}
                                returnKeyType='send'
                                onFocus={() => setFocused('input')}
                                onBlur={() => {
                                    onBlur()
                                    setFocused(null)
                                }}
                                autoCapitalize='none'
                                onSubmitEditing={handleSubmit(onSubmit, onInvalid)}
                                style={[
                                    formStyles.input,
                                    isFocused('input') && formStyles.inputFocused,
                                ]}
                            />
                        )}
                    />
					<TouchableOpacity onPress={handleSubmit(onSubmit, onInvalid)} style={styles.sendButton}>
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
		marginBottom: 12,
	},
	message: {
		paddingVertical: 4,
		fontSize: 14,
        color: '#fff',
	},
	messageList: {
		flexGrow: 1,
	},
	inputRow: {
		paddingVertical,
		paddingHorizontal,
	},	
	input: {
		flex: 1,
		borderWidth: 1,
		borderRadius: 6,
		paddingHorizontal: 12,
		backgroundColor: '#333',
		lineHeight: 40,
		fontSize: 20,
        color: '#fff',
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