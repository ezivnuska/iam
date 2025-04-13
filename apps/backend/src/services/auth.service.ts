import { User } from '../models/user.model'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/jwt'

export const registerUser = async (email: string, username: string, password: string) => {
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('User already exists')

  const hashedPassword = await hashPassword(password)

  const user = new User({ email, username, password: hashedPassword })
  await user.save()

  const token = generateToken({
    _id: user._id,
    email: user.email,
    role: user.role,
    username: user.username
  })

  return { token }
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Invalid credentials')

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')

  const token = generateToken({
    _id: user._id,
    email: user.email,
    role: user.role,
    username: user.username
  })

  return { token }
}