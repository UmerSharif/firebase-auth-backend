import User, { UserDocument } from '../models/User'
import { NotFoundError } from '../helpers/apiError'

async function findUserByEmail(email?: string): Promise<UserDocument> {
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError()
  }
  return user
}

async function create(payload: Partial<UserDocument>): Promise<UserDocument> {
  const newUser = new User({ ...payload })
  return newUser.save()
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
  return User.find()
}

export default {
  create,
  findUserByEmail,
  findOrCreate,
  findAllUser,
}
