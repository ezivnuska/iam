// apps/web/src/shared/forms/inputs/TextInputWithRef.tsx

import React, { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'

export const TextInputWithRef = forwardRef<TextInput, TextInputProps>((props, ref) => {
	return <TextInput ref={ref} {...props} />
})
