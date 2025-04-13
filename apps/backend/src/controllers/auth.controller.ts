import { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body
    const result = await authService.registerUser(email, username, password)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}


// type UserType = InferSchemaType<typeof User.schema>

// export const signin = async (_req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user: UserType = await authService.signin(_req.body)
//         res.json(user)
//     } catch (err) {
//         next(err)
//     }
// }

// export const signup = async (_req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user: UserType = await authService.signup(_req.body)
//         res.json(user)
//     } catch (err) {
//         next(err)
//     }
// }

// export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await userService.getUserById(req.params.id)
//         res.json(user)
//     } catch (err) {
//         next(err)
//     }
// }

// export const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const newUser = await userService.createUser(req.body)
//         res.status(201).json(newUser)
//     } catch (err) {
//         next(err)
//     }
// }

// export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const updatedUser = await userService.updateUser(req.params.id, req.body)
//         res.json(updatedUser)
//     } catch (err) {
//         next(err)
//     }
// }

// export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await userService.deleteUser(req.params.id)
//         res.status(204).send()
//     } catch (err) {
//         next(err)
//     }
// }