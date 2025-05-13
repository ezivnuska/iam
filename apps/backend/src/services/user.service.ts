// apps/backend/src/services/user.service.ts

import { UserModel } from '../models/user.model'
import { Image } from '../models/image.model'
import { comparePassword, hashPassword } from '../utils/password'

export const findAllUsers = async () => {
	return await UserModel.find().select('-password').populate('avatar') // Exclude passwords
}

export const findUserById = async (id: string) => {
	const user = await UserModel.findById(id).select('-password').populate('avatar')
	if (!user) throw new Error('User not found')
	return user
}

export const changeUserRole = async (id: string, newRole: string) => {
	const updated = await UserModel.findByIdAndUpdate(id, { role: newRole }, { new: true }).select('-password').populate('avatar')
	if (!updated) throw new Error('User not found or role update failed')
	return updated
}

export const updateUserSelf = async (
	id: string,
	data: Partial<{ username: string; bio?: string; avatar?: string }>
  ) => {
	const allowedFields = ['username', 'bio', 'avatar']
	const updates: Record<string, string> = {}
  
	for (const key of allowedFields) {
		if (data[key as keyof typeof data]) {
			updates[key] = data[key as keyof typeof data]!
		}
	}
  
	const updated = await UserModel.findByIdAndUpdate(id, updates, { new: true }).select('-password').populate('avatar')
	if (!updated) throw new Error('User not found or update failed')
  
	return updated
}

export const updateUser = async (id: string, data: Partial<{ email: string; username: string }>) => {
	const allowedFields = ['email', 'username']
	const updates: Record<string, string> = {}
  
	for (const key of allowedFields) {
		if (data[key as keyof typeof data]) {
			updates[key] = data[key as keyof typeof data]!
		}
	}
  
	const updated = await UserModel.findByIdAndUpdate(id, updates, { new: true }).select('-password').populate('avatar')
	if (!updated) throw new Error('User not found or update failed')
  
	return updated
}
  

export const removeUser = async (id: string) => {
	const deleted = await UserModel.findByIdAndDelete(id).populate('avatar')
	if (!deleted) throw new Error('User not found')
	return deleted
}

export const changeUserPassword = async (userId: string, current: string, next: string) => {
	const user = await UserModel.findById(userId).populate('avatar')
	if (!user) throw new Error('User not found')

	const valid = await comparePassword(current, user.password)
	if (!valid) throw new Error('Current password is incorrect')

	const newHashed = await hashPassword(next)
	user.password = newHashed
	await user.save()

	return true
}

export const setAvatarImage = async (username: string, imageId?: string) => {
	const user = await UserModel.findOne({ username })
	if (!user) throw new Error('User not found')

	if (imageId) {
		const image = await Image.findById(imageId)
		if (!image) throw new Error('Image not found')
		user.avatar = image._id
	} else {
		user.avatar = undefined // Remove avatar
	}

	await user.save()
	return user
}
