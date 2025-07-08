// apps/backend/src/controllers/profile.controller.ts

import { RequestHandler } from 'express'
import { getSocketServer } from '../lib/socket'

export const handleKoFi: RequestHandler = async (req, res) => {
	const donation = req.body

	console.log('Ko-fi donation received:', donation)

	const io = getSocketServer()
	io.emit('kofi:donation', {
		from: donation.from_name,
		amount: donation.amount,
		message: donation.message,
	})

	res.status(200).send('Received')
}