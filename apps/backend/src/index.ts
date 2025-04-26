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

//
// Enables cross origin resource sharing so the frontend can us this REST API.
//
// app.use(cors({
// 	origin: [
// 		'*',
// 		'http://localhost:3000',
// 		'http://localhost:4000',
// 		'https://iameric.me',
// 	],
// 	// alternatively use custom logic to determine the allowed origin
// 	// origin: (origin, callback) => callback(null, true)
// 	credentials: true,
// 	methods: [ 'GET', 'POST' ],
// 	allowedHeaders: [ 'Origin', 'X-Requested-With', 'Content-Type', 'Accept' ],
// }))

app.use(cors({
	origin: ['http://localhost:3000', 'https://iameric.me'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 200,
}))

app.options('*', cors())

app.use((req, res, next) => {
	if (req.method === 'OPTIONS') {
		res.sendStatus(200)
	} else {
		next()
	}
})

const sessionSecret = process.env.JWT_SECRET!

if (!sessionSecret) {
	throw new Error('JWT_SECRET must be defined in environment variables.')
}

//
// Configure session middleware
// https://www.npmjs.com/package/express-session
//
// app.use(session({
// 	secret: sessionSecret,
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: {
// 		secure: process.env.NODE_ENV === 'production',
// 		httpOnly: true,
// 		sameSite: 'lax',
// 	}
// }))

app.use(express.urlencoded({ extended: true }))

//
// Enables JSON in the request body.
//
app.use(express.json({ limit: '5mb' }))

app.use(cookieParser())

app.use(express.static('dist'))

app.use('/assets', express.static(path.resolve(__dirname, '../assets')))

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