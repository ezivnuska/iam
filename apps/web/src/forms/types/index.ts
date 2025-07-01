// apps/web/src/components/forms/types/index.ts

import { TextInput } from 'react-native'

export type FieldConfig<T> = {
	name: keyof T
	label: string
	secure?: boolean
	autoFocus?: boolean
    keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType']
}

export type AuthMode = 'signin' | 'signup'