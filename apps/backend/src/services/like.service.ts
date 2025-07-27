// apps/backend/src/services/like.service/ts

import { LikeModel } from '../models/like.model'
import { LikeRefType, ImageDocument, UserDocument } from '@iam/types'
import { Types } from 'mongoose'

interface ToggleLikeParams {
	userId: string | Types.ObjectId
	refId: string
	refType: LikeRefType
}

interface GetLikesParams {
	refId: string
	refType: LikeRefType
}

interface GetLikeMetaParams {
	userId?: string | Types.ObjectId
	refId: string
	refType: LikeRefType
}

export const isValidRefType = (refType: unknown): refType is LikeRefType => {
	return refType === 'Post' || refType === 'Image'
}

export const toggleLike = async ({
	userId,
	refId,
	refType,
}: ToggleLikeParams): Promise<{ likedByCurrentUser: boolean; count: number }> => {
	const existing = await LikeModel.findOne({ user: userId, refId, refType })

	if (existing) {
		await existing.deleteOne()
		const count = await LikeModel.countDocuments({ refId, refType })
		return { likedByCurrentUser: false, count }
	}

	await LikeModel.create({ user: userId, refId, refType })
	const count = await LikeModel.countDocuments({ refId, refType })
	return { likedByCurrentUser: true, count }
}

export const getLikes = async ({
	refId,
	refType,
}: GetLikesParams) => {
	const likes = await LikeModel.find({ refId, refType })
		.populate<{ user: UserDocument & { avatar?: ImageDocument } }>('user', 'username avatar')
		.populate<{ user: { avatar?: ImageDocument } }>('user.avatar')
		.sort({ createdAt: -1 })

	return likes.map((like) => {
		const user = like.user as UserDocument & { avatar?: ImageDocument }
		const avatar = user.avatar as ImageDocument | undefined

		return {
			id: like._id.toString(),
			refId: like.refId.toString(),
			refType: like.refType,
			user: {
				id: user._id.toString(),
				username: user.username,
				avatarUrl: avatar?.url ?? '',
			},
			createdAt: like.createdAt,
		}
	})
}

export const getLikeMeta = async ({
	userId,
	refId,
	refType,
}: GetLikeMetaParams): Promise<{ likedByCurrentUser: boolean; count: number }> => {

	const [liked, count] = await Promise.all([
		userId ? LikeModel.exists({ user: userId, refId, refType }) : Promise.resolve(false),
		LikeModel.countDocuments({ refId, refType }),
	])
	return {
		likedByCurrentUser: !!liked,
		count,
	}
}
