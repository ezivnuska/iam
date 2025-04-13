// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
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

// const userSchema = new mongoose.Schema({
//     password: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     username: { type: String, required: true, unique: true },
//     bio: { type: String },
//     profileImage: { type: mongoose.Schema.Types.ObjectId, ref: 'UserImage' },
//     role: { type: String, default: 'user' },
//     joinDate: { type: Date, default: Date.now() },
//     token: { type: String },
//     address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
//     location: {
//         latitude: { type: String },
//         longitude: { type: String },
//     },
//     exp: { type: Date },
// },
// { timestamps: true })

// UserSchema.pre('save', function(next) {

//   if(!this.isModified('password')) {
//     return next()
//   }

//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) return next(err)

//     bcrypt.hash(this.password, salt, (err, hash) => {
//       if(err) return next(err)
//       this.password = hash
//       console.log('new user PW hash', hash)

//       next()
//     })
//   })
// })

// export const User = mongoose.model('User', userSchema)

export const User = mongoose.model<IUser>('User', UserSchema)