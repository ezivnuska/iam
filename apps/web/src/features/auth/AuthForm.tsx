// apps/web/src/features/auth/AuthForm.tsx

import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import {
    DynamicForm,
	signinSchema,
	signinFields,
	signupSchema,
	signupFields,
} from '@shared/forms'
import { Column, Row } from '@shared/grid'
import { Button } from '@shared/buttons'
import { useAuthForm, useAuth } from '@features/auth'
import { useTheme } from '@shared/hooks'
import { z } from 'zod'
import type { AuthMode, FieldConfig } from '@shared/forms'
import { Size } from '@iam/theme'
import Ionicons from '@expo/vector-icons/Ionicons'

type AuthFormProps = {
	mode?: AuthMode
    dismiss?: () => void
}

export const AuthForm = ({
    mode = 'signin',
    dismiss,
}: AuthFormProps) => {
    const { handleSubmit } = useAuthForm<any>()
    const { secure, hideAuthModal } = useAuth()
    const { theme } = useTheme()
	const isSignin = mode === 'signin'

	const schema = isSignin ? signinSchema : signupSchema
	const fields = (isSignin ? signinFields : signupFields) as FieldConfig<z.infer<typeof schema>>[]
	const submitLabel = isSignin ? 'Sign In' : 'Sign Up'
	const title = isSignin ? 'Sign In' : 'Sign Up'

    const handleClose = () => {
        dismiss?.() || hideAuthModal()
    }

	return (
        // <Column flex={1} style={styles.content} spacing={Size.M}>
            
                <DynamicForm<typeof schema>
                    schema={schema}
                    fields={fields}
                    onSubmit={(data, setError) =>
                        handleSubmit(data, setError, { mode, saveEmail: true })
                    }
                    submitLabel={submitLabel}
                    prefillEmail
                />
            
        // </Column>
		
	)
}



const styles = StyleSheet.create({
    header: {
		flex: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: '600',
	},
	// subtitle: {
	// 	marginTop: 4,
	// 	fontSize: 16,
	// 	color: '#ddd',
	// },
	scrollview: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		width: '90%',
		maxWidth: 400,
		minWidth: 300,
        alignSelf: 'center',
	},
})

