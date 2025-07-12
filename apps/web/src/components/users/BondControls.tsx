// app/web/src/components/users/BondControls.tsx

import React from 'react'
import { IconButton, Row } from '@/components'
import { Bond } from '@iam/types'

type BondControlsProps = {
	bond?: Bond | null
	userId?: string
	onConfirm?: () => void
	onDelete?: () => void
	onCreate?: () => void
}

export const BondControls = ({ bond, userId, onConfirm, onDelete, onCreate }: BondControlsProps) => {
	if (!bond) {
		if (onCreate) {
			return (
				<IconButton
					iconName='person-add'
					onPress={onCreate}
				/>
			)
		}
		return null
	}

	const isPending = !bond.confirmed
	const isResponder = bond.responder === userId

	if (isPending) {
		if (isResponder && onConfirm && onDelete) {
			return (
				<Row spacing={10}>
					{onConfirm && (
						<IconButton
							onPress={onConfirm}
							iconName='checkmark-circle'
						/>
					)}
					{onDelete && (
						<IconButton
							onPress={onDelete}
							iconName='close-circle'
						/>
					)}
				</Row>
			)
		}
		if (!isResponder && onDelete) {
			return (
				<IconButton
					iconName='remove-circle'
					onPress={onDelete}
				/>
			)
		}
	}

	if (onDelete) {
		return (
			<IconButton
				iconName='person-remove-sharp'
				onPress={onDelete}
			/>
		)
	}

	return null
}
