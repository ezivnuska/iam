// apps/backend/src/index.ts

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { registerChatHandlers } from './controllers/chat.controller'

import adminRoutes from './routes/admin.routes'
import authRoutes from './routes/auth.routes'
import profileRoutes from './routes/profile.routes'
import userRoutes from './routes/user.routes'
import imageRoutes from './routes/image.routes'
import postRoutes from './routes/post.routes'
import commentRoutes from './routes/comment.routes'


// Default to development
const env = process.env.NODE_ENV || 'development'

// Try backend .env first, fallback only if not found
const localPath = path.resolve(__dirname, `../.env.${env}`)
const fallbackPath = path.resolve(__dirname, `../../../.env.${env}`)

if (!dotenv.config({ path: localPath }).parsed) {
    dotenv.config({ path: fallbackPath })
}

const API_PORT = process.env.API_PORT || 4000

const corsOptions = {
	origin: process.env.CORS_ORIGIN,
	credentials: true,
}

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: corsOptions })

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('dist'))

const imagesPath = path.resolve(__dirname, '../../images')
app.use('/images', express.static(imagesPath))

app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/users', userRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(500).json({ message: err.message || 'Unexpected error' })
})

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).send('OK')
})

io.on('connection', (socket) => {
	console.log(`Socket connected: ${socket.id}`)
	registerChatHandlers(io, socket)

	socket.on('disconnect', () => {
		console.log(`Socket disconnected: ${socket.id}`)
	})
})

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!)
		console.log('MongoDB connected')
        
        server.listen(API_PORT, () => {
            console.log(`Server running on http://localhost:${API_PORT}`)
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