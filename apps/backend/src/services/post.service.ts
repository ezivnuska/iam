// apps/backend/src/services/post.service.ts

import mongoose from 'mongoose'
import Post from '../models/post.model'
import { HttpError } from '../utils/HttpError'
import { UploadedImage } from '@iam/types'

export const getAllPosts = async (currentUserId?: string) => {
	const posts = await Post.find()
		.populate({
			path: 'author',
			select: 'username avatar',
			populate: { path: 'avatar', select: '_id filename variants username' },
		})
		.populate('image')
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

export const getPostById = async (id: string) => {
	const post = await Post.findById(id)
		.populate({
			path: 'author',
			select: 'username avatar',
			populate: {
				path: 'avatar',
				select: '_id filename variants username',
			},
		})
		.populate('image')

	if (!post) throw new HttpError('Post not found', 404)
	return post
}

// export const createPost = async (userId: string, content: string) => {
// 	const newPost = await Post.create({ author: userId, content })
// 	return newPost
// 		.populate({
// 			path: 'author',
// 			select: 'username avatar',
// 			populate: {
// 				path: 'avatar',
// 				select: '_id filename variants username',
// 			},
// 		})
// 		.then(p => p.toJSON({ virtuals: true }))
// }

export async function createPost(userId: string, content: string, image?: { id: string }) {
    const postData: any = { author: userId, content }

    if (image?.id) {
        postData.image = image.id
    }

    const post = await Post.create(postData)
	return await post.populate([
		{
			path: 'author',
			select: 'username avatar',
			populate: {
				path: 'avatar',
				select: '_id filename variants username',
			},
		},
		{ path: 'image' },
	])
}

export const updatePost = async (id: string, userId: string, content: string, image?: { id: string }) => {
	const post = await Post.findOne({ _id: id, author: userId })
		.populate({
			path: 'author',
			select: 'username avatar',
			populate: {
				path: 'avatar',
				select: '_id filename variants username',
			},
		})
		.populate('image')

	if (!post) throw new HttpError('Post not found or unauthorized', 404)

	post.content = content

	if (image?.id) {
		post.image = new mongoose.Types.ObjectId(image.id)
	}

	await post.save()
	return post.toJSON({ virtuals: true })
}

export const deletePost = async (id: string, userId: string) => {
	const result = await Post.deleteOne({ _id: id, author: userId })

	if (result.deletedCount === 0) {
		throw new HttpError('Post not found or unauthorized', 404)
	}

	return {
		success: true,
		message: 'Post deleted successfully',
	}
}

export const getPostLikes = async (postId: string) => {
	const post = await Post.findById(postId)
		.populate({
			path: 'likes',
			select: '_id username avatar',
			populate: {
				path: 'avatar',
				select: '_id filename variants',
			},
		})

	if (!post) throw new HttpError('Post not found', 404)
	return post.likes
}

export const togglePostLike = async (userId: string, postId: string) => {
	const post = await Post.findById(postId)

	if (!post) throw new HttpError('Post not found', 404)

	const userObjectId = new mongoose.Types.ObjectId(userId)
	const index = post.likes.findIndex(id => id.equals(userObjectId))

	if (index > -1) {
		post.likes.splice(index, 1) // Unlike
	} else {
		post.likes.push(userObjectId) // Like
	}

	await post.save()
	return post
}
