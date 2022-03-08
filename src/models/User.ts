/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
import { InternalServerError, BadRequestError } from '../helpers/apiError'

export type ItemInCart = {
  movies: string
  quantity: number
}

export type UserDocument = Document & {
  username: string
  firstName: string
  lastName: string
  email: string
  address: string
  password: string
  itemsInCart: ItemInCart[]
  comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema({
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  address: { type: String },
  password: String,
  itemsInCart: [
    {
      movies: { type: mongoose.Types.ObjectId, ref: 'Movie' },
      quantity: Number,
    },
  ],
})

userSchema.pre('save', async function (next) {
  const user = this as UserDocument
  if (!user.isModified('password')) return next()
  if (user.password) {
    try {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
      next()
    } catch (error) {
      next(new InternalServerError('', error))
    }
  } else {
    next(new BadRequestError('password not found'))
  }
})

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as UserDocument
  try {
    const isMatched = await bcrypt.compare(password, user.password)
    if (isMatched) return true
    else return false
  } catch (error) {
    return false
  }
}

export default mongoose.model<UserDocument>('User', userSchema)
