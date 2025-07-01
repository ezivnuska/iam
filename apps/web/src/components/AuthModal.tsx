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
import type { AuthMode } from '@/forms'

export const AuthModal = ({ initialMode = 'signin' }: { initialMode?: AuthMode }) => {
	const [mode, setMode] = useState<AuthMode>(initialMode)
	const { handleSubmit } = useAuthForm<any>()

	const isSignin = mode === 'signin'
	const schema = isSignin ? signinSchema : signupSchema
	const fields = isSignin ? signinFields : signupFields
	const submitLabel = isSignin ? 'Sign In' : 'Sign Up'
	const title = isSignin ? 'Welcome Back' : 'Create an Account'

	return (
		<ModalContainer title={title}>
			<Column>
				<DynamicForm
					schema={schema}
					fields={fields}
					onSubmit={(data, setError) =>
						handleSubmit(data, setError, { mode, saveEmail: true })
					}
					submitLabel={submitLabel}
					prefillEmail
				/>

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
