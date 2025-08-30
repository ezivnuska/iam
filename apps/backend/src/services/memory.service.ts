// apps/backend/src/services/memory.service.ts

import mongoose from 'mongoose'
import Memory from '../models/memory.model'
import { HttpError } from '../utils/HttpError'
import { normalizeId } from '../utils/normalizeId'

function formatMemory(memory: any) {
    if (!memory) return null
    const json = normalizeId(memory)

    // Normalize author
    if (json.author?._id) {
        json.author = normalizeId(json.author)
    }

    // Clean linkPreview
    if (json.linkPreview?.description?.trim?.() === '') {
        json.linkPreview.description = undefined
    }

    return json
}

export async function createMemory(userId: string, content: string, date: Date, imageId?: string) {
    const memoryData: any = {
        author: userId,
        content,
        date,
        image: imageId,
    }

    const memory = await Memory.create(memoryData)

    await memory.populate([
        {
            path: 'author',
            select: 'username avatar',
            populate: { path: 'avatar', select: '_id filename variants username' },
        },
        { path: 'image' },
    ])

    return formatMemory(memory)
}

export const getAllMemories = async () => {
    const memories = await Memory.find()
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: { path: 'avatar', select: '_id filename variants username' },
        })
        .populate('image')
        .sort({ createdAt: -1 })
    return memories.map(formatMemory)
}

export const getMemoryById = async (id: string) => {
    const memory = await Memory.findById(id)
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: { path: 'avatar', select: '_id filename variants username' },
        })
        .populate('image')

    if (!memory) throw new HttpError('Memory not found', 404)
    return formatMemory(memory)
}

export const updateMemory = async (
    id: string,
    userId: string,
    content: string,
    date: Date,
    image?: string,
) => {
    console.log('updating memory')
    console.log('memory id', id)
    console.log('author id', userId)
    console.log('content', content)
    console.log('image', image)
    console.log(' ')

    let updates = {
        content,
        date,
        image: image ? new mongoose.Types.ObjectId(image) : undefined,
    }

    console.log('updates', updates)

    const memory = await Memory.findByIdAndUpdate(id, updates, { new: true })
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: { path: 'avatar', select: '_id filename variants username' },
        })
        .populate('image')
    console.log('updated memory', memory)
    // if (!memory) throw new HttpError('Memory not found or unauthorized', 404)

    // memory.content = content
    // memory.date = date
    // if (image?.id) {
    //     memory.image = new mongoose.Types.ObjectId(image.id)
    // }

    // await memory.save()
    return formatMemory(memory)
}

export const deleteMemoryImage = async (
    id: string,
) => {
    const memory = await Memory.findOne({ _id: id })
        .populate({
            path: 'author',
            select: 'username avatar',
            populate: { path: 'avatar', select: '_id filename variants username' },
        })
        .populate('image')

    if (!memory) throw new HttpError('Memory not found or unauthorized', 404)

    memory.image = null

    await memory.save()
    return formatMemory(memory)
}

export const deleteMemory = async (id: string, userId: string) => {
    const result = await Memory.deleteOne({ _id: id, author: userId })
    console.log('memory deleted', result)
    if (result.deletedCount === 0) {
        throw new HttpError('Memory not found or unauthorized', 404)
    }

    return { success: true, message: 'Memory deleted successfully' }
}
