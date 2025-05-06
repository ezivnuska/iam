// apps/backend/src/services/__tests__/image.service.test.ts

import * as fs from 'fs/promises'
import { Image } from '../../models/image.model'
import * as service from '../image.service'

jest.mock('sharp', () => () => ({
	resize: jest.fn().mockReturnThis(),
	webp: jest.fn().mockReturnThis(),
	metadata: jest.fn().mockResolvedValue({ width: 800, height: 600 }),
	toFile: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('../../models/image.model')

jest.mock('mongoose', () => ({
	...jest.requireActual('mongoose'),
	Model: {
		findById: jest.fn(),
		deleteOne: jest.fn(),
	},
}))

describe('Image Service', () => {
	const mockUsername = 'test-user'
	const mockFilename = '123456.webp'
	const mockImage = {
		_id: 'abc123',
		filename: mockFilename,
		username: mockUsername,
		width: 800,
		height: 600,
		alt: '',
	}

	beforeEach(() => {
		jest.clearAllMocks()
	})

	// describe('processAndSaveImage', () => {
	// 	it('should save image and return metadata', async () => {
	// 		(Image.create as jest.Mock).mockResolvedValue(mockImage)

	// 		// Mock fs.promises.mkdir with jest.spyOn and .mockImplementationOnce
	// 		jest.spyOn(fs, 'mkdir').mockImplementationOnce(() => Promise.resolve(undefined))

	// 		const result = await service.processAndSaveImage({
	// 			fileBuffer: Buffer.from('test'),
	// 			originalName: 'photo.png',
	// 			username: mockUsername,
	// 		})

	// 		expect(Image.create).toHaveBeenCalled()
	// 		expect(result.filename).toBe(mockFilename)
	// 	})
	// })

	// describe('deleteImage', () => {
	// 	it('should delete image file and metadata', async () => {
	// 		(Image.findById as jest.Mock).mockResolvedValue(mockImage)

	// 		// Mock fs.promises.unlink with jest.spyOn and .mockImplementationOnce
    //         jest.spyOn(fs, 'unlink').mockResolvedValueOnce(undefined)

	// 		(Image.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 })

	// 		const result = await service.deleteImage('abc123', mockUsername)

	// 		expect(result).toBe(true)
	// 		expect(fs.unlink).toHaveBeenCalled()
	// 		expect(Image.deleteOne).toHaveBeenCalled()
	// 	})

	// 	it('should fail if user mismatch', async () => {
	// 		(Image.findById as jest.Mock).mockResolvedValue({ ...mockImage, username: 'hacker' })

	// 		await expect(service.deleteImage('abc123', mockUsername)).rejects.toThrow(
	// 			'You can only delete your own images'
	// 		)
	// 	})

	// 	it('should return false if file not found', async () => {
	// 		(Image.findById as jest.Mock).mockResolvedValue(mockImage)

	// 		// Simulating file not found error
	// 		const fileNotFoundError = new Error('File not found') as NodeJS.ErrnoException
	// 		fileNotFoundError.code = 'ENOENT'

	// 		// Mock fs.promises.unlink with a rejected value
	// 		jest.spyOn(fs, 'unlink').mockRejectedValueOnce(fileNotFoundError)

	// 		const result = await service.deleteImage('abc123', mockUsername)
	// 		expect(result).toBe(false)
	// 	})
	// })

	describe('getImagesByUsername', () => {
		it('should return sorted images', async () => {
			(Image.find as jest.Mock).mockReturnValue({
				sort: jest.fn().mockResolvedValue([mockImage]),
			})

			const result = await service.getImagesByUsername(mockUsername)
			expect(result[0].filename).toBe(mockFilename)
		})
	})
})