// apps/backend/src/controllers/memory.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as memoryService from '../services/memory.service'
import { Comment } from '../models/comment.model'
import { RefType } from '@iam/types'
// import { ScrapeError, scrapeMetadata } from '../utils/metadata.utils'

/* ------------------------------- POST CRUD ------------------------------- */

export const createMemory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { content, date, imageId } = req.body
		const memory = await memoryService.createMemory(req.user!.id, content, date, imageId)
		res.status(201).json(memory)
	} catch (err) {
		next(err)
	}
}

export const getAllMemories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const memories = await memoryService.getAllMemories()
		res.json(memories)
	} catch (err) {
		next(err)
	}
}

export const getMemoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const memory = await memoryService.getMemoryById(req.params.id)
		res.json(memory)
	} catch (err) {
		next(err)
	}
}

export const updateMemory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const memory = await memoryService.updateMemory(req.params.id, req.user!.id, req.body.content, req.body.date, req.body.imageId)
		res.json(memory)
	} catch (err) {
		next(err)
	}
}

export const deleteMemory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await memoryService.deleteMemory(req.params.id, req.user!.id)
		await Comment.deleteMany({ refId: req.params.id, refType: RefType.Memory })
		res.status(204).end()
	} catch (err) {
		next(err)
	}
}
