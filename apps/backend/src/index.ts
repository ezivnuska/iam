import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import session from 'express-session'
import cors from 'cors'
import path from 'path'

import adminRoutes from './routes/admin.routes'
import authRoutes from './routes/auth.routes'
import profileRoutes from './routes/profile.routes'
import userRoutes from './routes/user.routes'

require('dotenv').config()

const app = express()
const port = 4000

//
// Enables cross origin resource sharing so the frontend can us this REST API.
//
app.use(cors({
	origin: [
		'*',
		'http://localhost:3000',
		'http://localhost:4000',
		'https://iameric.me',
	],
	// alternatively use custom logic to determine the allowed origin
	// origin: (origin, callback) => callback(null, true)
	credentials: true,
	methods: [ 'GET', 'POST' ],
	allowedHeaders: [ 'Origin', 'X-Requested-With', 'Content-Type', 'Accept' ],
}))

//
// Configure session middleware
// https://www.npmjs.com/package/express-session
//
app.use(session({
	secret: process.env.JWT_SECRET || require('@config').JWT_SECRET,
	resave: false, // set to true to reset session on every request
	saveUninitialized: true,
}))

app.use(express.urlencoded({ extended: true }))

//
// Enables JSON in the request body.
//
app.use(express.json({ limit: '5mb' }))

app.use(express.static('dist'))

app.use('/assets', express.static(path.resolve(__dirname, '../assets')))

app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/users', userRoutes)

app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(500).json({ message: err.message || 'Unexpected error' })
})

// const connectToMongoDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI || require('./config').MONGO_URI)
//         console.log(`\n\n* * *\n** MongoDB connected **\n* * *\n\n`)
//     } catch (err) {
//         console.log(err)
//     }
// }

// connectToMongoDB()

// change to:
const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI!)
		console.log('MongoDB connected')
		app.listen(3000, () => console.log('Server running on http://localhost:3000'))
	} catch (err) {
		console.error('Failed to start server:', err)
	}
}
  
start()

// server.listen(process.env.PORT, () => {
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`)
})



//
// The validation code library is shared between backend and frontend 
// without being published to npm.
// 
// import { validateTodo, IAddTodoPayload, IGetTodosResponse, ITodoItem } from 'validation'

//
// List of items in the todo list.
// Normally in a production application this might be stored in a database.
// For simplicity it is stored in memory.
//
// const todoList: ITodoItem[] = [
//     {
//         text: 'Feed the cat',
//     },
//     {
//         text: 'Go to work',
//     },
//     {
//         text: 'Have a delicious ice cream',
//     },
// ]

//
// Adds an item to the todo list.
//
// app.post('/todo', (req, res) => {

//     const payload = req.body as IAddTodoPayload
//     const todoItem = payload.todoItem
//     const result = validateTodo(todoItem)
//     if (!result.valid) {
//         res.status(400).json(result)
//         return
//     }

//     //
//     // The todo item is valid, add it to the todo list.
//     //
//     todoList.push(todoItem)
//     res.sendStatus(200)
// })

//
// Gets the todo list.
//
// app.get('/todos', (req, res) => {
//     const response: IGetTodosResponse = {
//         todoList: todoList,
//     }

//     res.json(response)
// })

// app.listen(port, () => {
//     console.log(`Todo list app listening on port ${port}`)
// })