// apps/backend/src/services/post.service.ts

import mongoose from 'mongoose'
import Post from '../models/post.model'
import { HttpError } from '../utils/HttpError'
import { scrapeMetadata } from '../utils/metadata.utils'
import { extractFirstUrl } from '../utils/extractFirstUrl'

export async function createPost(userId: string, content: string, imageId?: string) {
    const postData: any = {
        author: userId,
        content,
        image: imageId, 
    }
    
    const firstUrl = extractFirstUrl(content)
    if (firstUrl) {
        postData.linkUrl = firstUrl

        try {
            const metadata = await scrapeMetadata(firstUrl)
            if (metadata) {
                postData.linkPreview = metadata
            }
        } catch (err) {
            console.warn(`Failed to scrape link metadata for ${firstUrl}:`, err)
        }
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

export const getAllPosts = async () => {
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
	
		if (json.linkPreview) {
			if (
				typeof json.linkPreview.description === 'string' &&
				json.linkPreview.description.trim() === ''
			) {
				json.linkPreview.description = undefined
			}
		}
	
		return json
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
	console.log('post deleted', result)
	if (result.deletedCount === 0) {
		throw new HttpError('Post not found or unauthorized', 404)
	}

	return {
		success: true,
		message: 'Post deleted successfully',
	}
}

export async function scrapeAndUpdateLinkPreview(postId: string) {
	const post = await Post.findById(postId)
	if (!post || !post.linkUrl) return null

	try {
		const metadata = await scrapeMetadata(post.linkUrl)
		post.linkPreview = metadata
		await post.save()

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
	} catch (err) {
		console.warn(`Failed to scrape metadata for post ${postId}:`, err)
		throw new HttpError('Metadata scraping failed', 500)
	}
}
