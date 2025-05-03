// apps/backend/src/index.ts

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
// import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'

import adminRoutes from './routes/admin.routes'
import authRoutes from './routes/auth.routes'
import profileRoutes from './routes/profile.routes'
import userRoutes from './routes/user.routes'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 4000

app.use(cookieParser())

//
// Enables cross origin resource sharing
//
app.use(cors({
	origin: ['http://localhost:3000', 'https://iameric.me'],
	credentials: true,
}))

//
// Enables JSON in the request body.
//
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

const sessionSecret = process.env.JWT_SECRET!

if (!sessionSecret) {
	throw new Error('JWT_SECRET must be defined in environment variables.')
}

app.use(express.static('dist'))

// Serve /uploads/users as /images/
const uploadsPath = path.resolve(__dirname, '../../uploads/users')
app.use('/images', express.static(uploadsPath))

app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/users', userRoutes)

app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(500).json({ message: err.message || 'Unexpected error' })
})

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!)
		console.log('MongoDB connected')

		// server.listen(process.env.PORT, () => {
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`)
		})
	} catch (err) {
		console.error('MongoDB connection error:', err)
	}
}

process.on('SIGINT', async () => {
	console.log('Received SIGINT, shutting down gracefully...')
	
	try {
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
		process.exit(0)
	} catch (err) {
		console.error('Error during MongoDB disconnection', err)
		process.exit(1)
	}
})
  
process.on('SIGTERM', async () => {
	console.log('Received SIGTERM, shutting down gracefully...')
	
	try {
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
		process.exit(0)
	} catch (err) {
		console.error('Error during MongoDB disconnection', err)
		process.exit(1)
	}
})
  
start()