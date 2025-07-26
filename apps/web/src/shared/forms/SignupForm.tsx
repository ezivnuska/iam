// apps/web/src/featured/auth/forms/SignupForm.tsx

import React from 'react'
import { Button } from '@shared/buttons'
import { Column } from '@shared/grid'
import { signupSchema, signupFields, SigninForm } from './'
import { DynamicForm, FormContainer } from '@shared/forms'
import { useAuth, useAuthForm, useModal } from '@shared/hooks'
import { Size } from '@iam/theme'

export const SignupForm = () => {
    const { authenticate } = useAuth()
    const { openFormModal } = useModal()
    const { handleSubmit } = useAuthForm<any>(authenticate)

	return (
		<FormContainer title='Create an Account'>
			<Column spacing={Size.M}>
				<DynamicForm<typeof signupSchema>
					schema={signupSchema}
					fields={signupFields}
					onSubmit={(data, setError) =>
						handleSubmit(data, setError, { mode: 'signup', saveEmail: true })
					}
					submitLabel='Sign Up'
					prefillEmail
				/>

                <Button
                    label='Sign In'
                    onPress={() => openFormModal(SigninForm, {}, { title: 'Sign In' })}
                    variant='transparent'
                />
			</Column>
		</FormContainer>
	)
}
