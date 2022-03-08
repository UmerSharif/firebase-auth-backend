/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

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

export default mongoose.model<UserDocument>('User', userSchema)
