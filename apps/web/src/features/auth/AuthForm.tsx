// apps/web/src/features/auth/AuthForm.tsx

import React from 'react'
import { DynamicForm, signinSchema, signinFields, signupSchema, signupFields } from '@shared/forms'
import { useAuthForm, useAuth } from '@features/auth'
import { useTheme } from '@shared/hooks'
import type { FieldConfig } from '@shared/forms'
import { AuthMode } from '@shared/forms'
import { z } from 'zod'

type AuthFormProps = {
	mode?: AuthMode
	dismiss?: () => void
}

export const AuthForm = ({ mode = AuthMode.SIGNIN, dismiss }: AuthFormProps) => {
	const { handleSubmit } = useAuthForm<any>()
	const { hideAuthModal } = useAuth()
	const { theme } = useTheme()

	const isSignin = mode === 'signin'
	const schema = isSignin ? signinSchema : signupSchema
	const fields = (isSignin ? signinFields : signupFields) as FieldConfig<z.infer<typeof schema>>[]
	const submitLabel = isSignin ? 'Sign In' : 'Sign Up'

	const handleClose = () => {
		dismiss?.() || hideAuthModal()
	}

	return (
		<DynamicForm<typeof schema>
			schema={schema}
			fields={fields}
			onSubmit={(data, setError) =>
				handleSubmit(data, setError, { mode, saveEmail: true })
			}
			submitLabel={submitLabel}
			prefillEmail
		/>
	)
}
