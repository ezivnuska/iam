// apps/backend/src/models/user.model.ts

import mongoose, { Schema } from 'mongoose'

export interface IUser {
  email: string
  username: string
  password: string
  role: string
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
}, {
  timestamps: true,
})

export const User = mongoose.model<IUser>('User', UserSchema)