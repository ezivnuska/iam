// middlewares/upload.middleware.ts
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const username = req.body.username
		const userDir = path.resolve(__dirname, '../../../uploads/users', username)

		fs.mkdirSync(userDir, { recursive: true })
		cb(null, userDir)
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now()
		const ext = path.extname(file.originalname)
		cb(null, `${timestamp}${ext}`)
	},
})

export const upload = multer({ storage })