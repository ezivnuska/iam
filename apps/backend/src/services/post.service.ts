// apps/backend/src/services/post.service.ts

import PostModel from '../models/post.model'
import { PartialUser } from '@iam/types'

export const getAllPosts = async () => {
	const posts = await PostModel.find()
		.populate({
			path: 'user',
			select: 'username avatar',
			populate: {
				path: 'avatar',
				select: '_id filename username',
			},
		})
		.sort({ createdAt: -1 })
		.lean({ virtuals: true })

	return posts.map((post) => {
		const user = post.user as PartialUser
		if (user?.username && user.avatar?.filename) {
			user.avatarUrl = `/images/users/${user.username}/${user.avatar.filename}`
		}
		return post
	})
}

export const getPostById = (id: string) =>
    PostModel.findById(id)
        .populate({
            path: 'user',
            select: 'username avatar',
            populate: {
                path: 'avatar',
                select: '_id',
            },
        })
        .lean({ virtuals: true })
          

export const createPost = async (userId: string, content: string) => {
    const newPost = await PostModel.create({ user: userId, content })
    return newPost
        .populate({
            path: 'user',
            select: 'username avatar',
            populate: {
                path: 'avatar',
                select: '_id',
            },
        })
        .then((p) => p.toJSON({ virtuals: true }))
    }
          

export const updatePost = async (id: string, userId: string, content: string) => {
    const post = await PostModel.findOne({ _id: id, user: userId })
        .populate({
            path: 'user',
            select: 'username avatar',
            populate: {
                path: 'avatar',
                select: '_id',
            },
        })
    
    if (!post) throw new Error('Post not found or unauthorized')
    post.content = content
    await post.save()
    return post.toJSON({ virtuals: true })
}      

export const deletePost = async (id: string, userId: string) => {
	const result = await PostModel.deleteOne({ _id: id, user: userId })
	if (result.deletedCount === 0) throw new Error('Post not found or unauthorized')
}
