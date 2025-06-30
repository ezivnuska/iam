// apps/web/src/hooks/useBondSocket.ts

import { useEffect } from 'react'
import { useSocket } from './useSocket'
import type { Bond } from '@iam/types'

export const useBondSocket = (
	userId: string,
	{
		onCreated,
		onUpdated,
		onDeleted,
		onError,
	}: {
		onCreated?: (bond: Bond) => void
		onUpdated?: (bond: Bond) => void
		onDeleted?: (bondId: string) => void
		onError?: (msg: string) => void
	} = {}
) => {
	const {
		onBondCreated,
		onBondUpdated,
		onBondDeleted,
		onBondError,
	} = useSocket()

	useEffect(() => {
		if (!userId) return

		const offCreated = onBondCreated((bond) => {
			if (bond.sender === userId || bond.responder === userId) {
				onCreated?.(bond)
			}
		})		  
		
		const offUpdated = onBondUpdated((bond) => {
			if (bond.sender === userId || bond.responder === userId) {
				onUpdated?.(bond)
			}
		})

		const offDeleted = onBondDeleted((bondId) => {
			onDeleted?.(bondId)
		})

		const offError = onBondError((error) => {
			onError?.(error)
		})

		return () => {
			offCreated()
			offUpdated()
			offDeleted()
			offError()
		}
	}, [userId, onCreated, onUpdated, onDeleted, onError])
}
