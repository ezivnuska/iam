// apps/backend/src/services/post.service.ts

import PostModel from '../models/post.model'

export const getAllPosts = () => PostModel.find().populate({
    path: 'user',
    select: 'username avatar',
  }).sort({ createdAt: -1 })

export const getPostById = (id: string) => PostModel.findById(id).populate('user')

export const createPost = async (userId: string, content: string) => {
    const newPost = await PostModel.create({ user: userId, content })
    return newPost.populate('user', 'username avatar')
  }

export const updatePost = async (id: string, userId: string, content: string) => {
	const post = await PostModel.findOne({ _id: id, user: userId }).populate('user', 'username avatar')
	if (!post) throw new Error('Post not found or unauthorized')
	post.content = content
	return post.save()
}

export const deletePost = async (id: string, userId: string) => {
	const result = await PostModel.deleteOne({ _id: id, user: userId })
	if (result.deletedCount === 0) throw new Error('Post not found or unauthorized')
}
