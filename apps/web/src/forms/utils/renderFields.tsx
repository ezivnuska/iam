// apps/web/src/forms/utils/renderFields.tsx

import React from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { FormField } from '@/forms'
import type { FieldConfig } from '@/forms'
import { StyleSheet, View } from 'react-native'

export function renderFields<T extends FieldValues>(
    fields: FieldConfig<T>[],
    control: Control<T>,
    errors: Partial<Record<keyof T, any>>
) {
    return (
        <View style={styles.container}>
            {fields.map(({ name, label, secure, autoFocus }) => (
                <FormField<T>
                    key={name as string}
                    name={name as Path<T>}
                    label={label}
                    control={control}
                    error={errors[name]}
                    secure={secure}
                    autoFocus={autoFocus}
                />
            ))}
        </View>
    )
}


const styles = StyleSheet.create({
	container: {
		marginVertical: 12,
	}
})