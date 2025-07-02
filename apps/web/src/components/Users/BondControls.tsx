// app/web/src/components/Users/BondControls.tsx

import React from 'react'
import { IconButton, Row } from '@/components'
import { Bond } from '@iam/types'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

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
					icon={<MaterialIcons name='person-add' size={30} color='blue' />}
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
							icon={<MaterialIcons name='check-circle' size={30} color='green' />}
						/>
					)}
					{onDelete && (
						<IconButton
							onPress={onDelete}
							icon={<MaterialIcons name='cancel' size={30} color='red' />}
						/>
					)}
				</Row>
			)
		}
		if (!isResponder && onDelete) {
			return (
				<IconButton
					icon={<MaterialCommunityIcons name='clock-minus' size={30} color='red' />}
					onPress={onDelete}
				/>
			)
		}
	}

	if (onDelete) {
		return (
			<IconButton
				icon={<MaterialIcons name='person-remove' size={30} color='red' />}
				onPress={onDelete}
			/>
		)
	}

	return null
}
