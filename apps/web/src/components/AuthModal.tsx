// apps/web/src/components/AuthModal.tsx

import React, { useState } from 'react'
import { ModalContainer, Column, Row, Button } from '@/components'
import {
	DynamicForm,
	signinSchema,
	signinFields,
	signupSchema,
	signupFields,
	useAuthForm,
} from '@/forms'
import { z } from 'zod'
import type { AuthMode, FieldConfig } from '@/forms'

type SigninSchemaType = typeof signinSchema
type SignupSchemaType = typeof signupSchema

export const AuthModal = ({ initialMode = 'signin' }: { initialMode?: AuthMode }) => {
	const [mode, setMode] = useState<AuthMode>(initialMode)
	const { handleSubmit } = useAuthForm<any>()

	const isSignin = mode === 'signin'
	const submitLabel = isSignin ? 'Sign In' : 'Sign Up'
	const title = isSignin ? 'Welcome Back' : 'Create an Account'

	return (
		<ModalContainer title={title}>
			<Column>
				{isSignin ? (
					<DynamicForm<SigninSchemaType>
						schema={signinSchema}
						fields={signinFields as FieldConfig<z.infer<SigninSchemaType>>[]}
						onSubmit={(data, setError) =>
							handleSubmit(data, setError, { mode, saveEmail: true })
						}
						submitLabel='Sign In'
						prefillEmail
					/>
				) : (
					<DynamicForm<SignupSchemaType>
						schema={signupSchema}
						fields={signupFields as FieldConfig<z.infer<SignupSchemaType>>[]}
						onSubmit={(data, setError) =>
							handleSubmit(data, setError, { mode, saveEmail: true })
						}
						submitLabel='Sign Up'
						prefillEmail
					/>
				)}

				<Row spacing={10} justify='space-evenly'>
					<Button
						label={isSignin ? 'Need an account?' : 'Already have one?'}
						onPress={() => setMode(isSignin ? 'signup' : 'signin')}
						transparent
					/>
				</Row>
			</Column>
		</ModalContainer>
	)
}
