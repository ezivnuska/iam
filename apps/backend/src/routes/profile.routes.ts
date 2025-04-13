import { Router } from 'express'
import { updateSelf } from '../controllers/profile.controller'
import { authenticate } from '../middlewares/authMiddleware'
import { changePassword } from '../controllers/profile.controller'

const router: ReturnType<typeof Router> = Router()

// Get current user profile
router.get('/', authenticate, (req, res) => {
	res.json({ user: req.user })
})

// Update profile info
router.patch('/', authenticate, updateSelf)

// Change password
router.post('/change-password', authenticate, changePassword)

export default router
