// apps/backend/src/index.ts

import './loadEnv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

import type { Request, Response, ErrorRequestHandler } from 'express'
import { initSockets } from './sockets'
import { errorHandler } from './middleware/error.middleware'
import { registerSocketServer } from './lib/socket'

import adminRoutes from './routes/admin.routes'
import authRoutes from './routes/auth.routes'
import bondRoutes from './routes/bond.routes'
import profileRoutes from './routes/profile.routes'
import userRoutes from './routes/user.routes'
import imageRoutes from './routes/image.routes'
import postRoutes from './routes/post.routes'
import commentRoutes from './routes/comment.routes'
import kofiRoutes from './routes/kofi.routes'
import likeRoutes from './routes/like.routes'

// --- Constants ---
const API_PORT = parseInt(process.env.API_PORT || '4000', 10)

const corsOptions = {
	origin: process.env.CORS_ORIGIN,
	credentials: true,
}

// --- Initialize App & Server ---
const app = express()
const server = createServer(app)

const io = new Server(server, { cors: corsOptions })
registerSocketServer(io)
initSockets(io)

// --- Express Middleware ---
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))

const imagesPath = path.resolve(__dirname, '../../images')
app.use('/images', express.static(imagesPath))

// --- API Routes ---
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/bond', bondRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/users', userRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.post('/api/kofi', kofiRoutes)
app.use('/api/likes', likeRoutes)

// --- Misc Handlers ---
app.get('/health', (req: Request, res: Response) => {
	res.status(200).send('OK')
})

app.use((req: Request, res: Response) => {
	res.status(404).json({ message: 'Not Found' })
})

app.use(errorHandler as ErrorRequestHandler)

// --- Database & Server Startup ---
mongoose.connection.on('error', (err) => {
	console.error('MongoDB connection error:', err)
})

const start = async () => {
	try {
		const mongoUri = process.env.MONGO_URI
		if (!mongoUri) throw new Error('Missing MONGO_URI in environment')

		await mongoose.connect(mongoUri)
		console.log('MongoDB connected')

		server.listen(API_PORT, () => {
			console.log(`Server running on http://localhost:${API_PORT}`)
		})
	} catch (err) {
		console.error('MongoDB connection error:', err)
	}
}

// --- Graceful Shutdown ---
const shutdown = async () => {
	console.log('Shutting down gracefully...')
	try {
		await mongoose.connection.close()
		console.log('MongoDB connection closed')
		process.exit(0)
	} catch (err) {
		console.error('Error during shutdown', err)
		process.exit(1)
	}
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

start()