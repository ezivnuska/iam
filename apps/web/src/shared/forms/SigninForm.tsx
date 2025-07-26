// apps/web/src/shared/forms/SigninForm.tsx

import React from 'react'
import { Button } from '@shared/buttons'
import { Column } from '@shared/grid'
import { signinSchema, signinFields, SignupForm } from './'
import { DynamicForm, FormContainer } from '@shared/forms'
import { useAuth, useAuthForm, useModal } from '@shared/hooks'
import { Size } from '@iam/theme'

export const SigninForm = () => {
    const { authenticate } = useAuth()
    const { openFormModal } = useModal()
    const { handleSubmit } = useAuthForm<any>(authenticate)

	return (
		<FormContainer title='Welcome Back'>
			<Column spacing={Size.M}>
				<DynamicForm<typeof signinSchema>
					schema={signinSchema}
					fields={signinFields}
					onSubmit={(data, setError) =>
						handleSubmit(data, setError, { mode: 'signin', saveEmail: true })
					}
					submitLabel='Sign In'
					prefillEmail
				/>

                <Button
                    label='Need an account?'
                    onPress={() => openFormModal(SignupForm, {}, { title: 'Sign Up' })}
                    variant='transparent'
                />
			</Column>
		</FormContainer>
	)
}
