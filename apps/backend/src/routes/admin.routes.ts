import { Router, Response } from 'express'
import { authenticate, requireRole, AuthenticatedRequest } from '../middlewares/authMiddleware'

const router: ReturnType<typeof Router> = Router()

router.get('/dashboard', authenticate, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
	res.json({ message: `Welcome to the admin dashboard, ${req.user.username}` })
})

export default router