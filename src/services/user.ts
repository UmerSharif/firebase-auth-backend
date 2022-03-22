import User, { UserDocument } from '../models/User'
import { NotFoundError } from '../helpers/apiError'
import jwt from 'jsonwebtoken'

async function findUserByEmail(email?: string): Promise<UserDocument | null> {
  const user = await User.findOne({ email })
  return user
}

async function create(user: UserDocument): Promise<UserDocument> {
  return user.save()
}

async function findOrCreate(payload: Partial<UserDocument>) {
  return User.findOne({ email: payload.email })
    .exec() // .exec() will return a true Promise
    .then((user) => {
      if (!user) {
        const newUser = new User({
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        })
        newUser.save()
        return newUser
      }
      return user
    })
}

async function findAllUser(): Promise<UserDocument[]> {
  return User.find().select('-password')
}

const generateToken = (user: Partial<UserDocument>) => {
  const { email, id, isAdmin } = user
  const token = jwt.sign({ email, id, isAdmin }, 'JWT_SECRET', {
    expiresIn: 500,
  })
  return token
}

export default {
  generateToken,
  create,
  findUserByEmail,
  findOrCreate,
  findAllUser,
}
