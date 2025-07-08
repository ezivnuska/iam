// apps/web/src/components/modals/AuthModal.tsx

import React, { useState } from 'react'
import { ModalContainer, Column, Row, Button } from '@/components'
import {
	DynamicForm,
	signinSchema,
	signinFields,
	signupSchema,
	signupFields,
} from '@/forms'
import { useAuthForm } from '@/hooks'
import { z } from 'zod'
import type { AuthMode, FieldConfig } from '@/types'
import { AuthResponseType } from '@iam/types'

type AuthModalProps = {
	initialMode?: AuthMode
    authenticate: (user: AuthResponseType) => void
	onDismiss?: () => void
}

export const AuthModal = ({
    initialMode = 'signin',
    authenticate,
    onDismiss,
}: AuthModalProps) => {
	const [mode, setMode] = useState<AuthMode>(initialMode)
    const { handleSubmit } = useAuthForm<any>(authenticate)
	const isSignin = mode === 'signin'

	const schema = isSignin ? signinSchema : signupSchema
	const fields = (isSignin ? signinFields : signupFields) as FieldConfig<z.infer<typeof schema>>[]
	const submitLabel = isSignin ? 'Sign In' : 'Sign Up'
	const title = isSignin ? 'Welcome Back' : 'Create an Account'

	return (
		<ModalContainer title={title} onDismiss={onDismiss}>
			<Column>
				<DynamicForm<typeof schema>
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
