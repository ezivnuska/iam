// apps/backend/src/services/post.service.ts

import mongoose from 'mongoose'
import PostModel from '../models/post.model'

export const getAllPosts = async (currentUserId?: string) => {
	const posts = await PostModel.find()
		.populate({
			path: 'author',
			select: 'username avatar',
			populate: { path: 'avatar', select: '_id filename variants username' },
		})
		.sort({ createdAt: -1 })

	return posts.map(post => {
		const json = post.toJSON()

		return {
			...json,
			likes: json.likes.map((id: mongoose.Types.ObjectId) => id.toString()),
			likedByCurrentUser: currentUserId
                ? json.likes.some((id: mongoose.Types.ObjectId) => id.equals(currentUserId))
                : false,
		}
	})
}

export const getPostById = async (id: string) =>
    await PostModel.findById(id)
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: {
                path: 'avatar',
                select: '_id filename variants username',
            },
        })
          

export const createPost = async (userId: string, content: string) => {
    const newPost = await PostModel.create({ author: userId, content })
    return newPost
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: {
                path: 'avatar',
                select: '_id filename variants username',
            },
        })
        .then((p) => p.toJSON({ virtuals: true }))
    }
          

export const updatePost = async (id: string, userId: string, content: string) => {
    const post = await PostModel.findOne({ _id: id, user: userId })
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: {
                path: 'avatar',
                select: '_id filename variants username',
            },
        })
    
    if (!post) throw new Error('Post not found or unauthorized')
    
    post.content = content
    await post.save()

    return post.toJSON({ virtuals: true })
}      

export const deletePost = async (id: string, userId: string) => {
	const result = await PostModel.deleteOne({ _id: id })
	
    if (result.deletedCount === 0) {
        throw new Error('Post not found or unauthorized')
    }
    
    return {
        success: true,
        message: 'Post deleted successfully',
    }
}

export const getPostLikes = async (postId: string) => {
	const post = await PostModel.findById(postId).populate({
		path: 'likes',
		select: '_id username avatar',
		populate: {
			path: 'avatar',
			select: '_id filename variants',
		},
	})

	if (!post) return null
	return post.likes
}

export const toggleLike = async (userId: string, postId: string) => {
	try {
        const post = await PostModel.findById(postId)
    
        if (!post) throw new Error('Post not found')

        const userObjectId = new mongoose.Types.ObjectId(userId)
        const index = post.likes.findIndex((id) => id.equals(userObjectId)) // Use `.equals()` for ObjectId comparison

        if (index > -1) {
            // Unlike
            post.likes.splice(index, 1)
        } else {
            // Like
            post.likes.push(userObjectId)
        }

        await post.save()
        return post
    } catch (err) {
        return null
    }
}

