// apps/web/src/shared/forms/form.types.ts

import { TextInput } from 'react-native'

export type FieldConfig<T> = {
    name: keyof T
    label?: string
    secure?: boolean
    autoFocus?: boolean
    keyboardType?: React.ComponentProps<typeof TextInput>['keyboardType']
    placeholder?: string
}

export type AuthMode = 'signin' | 'signup'