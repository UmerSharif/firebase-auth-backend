import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '../util/secrets'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, email, password, username } = req.body
    //bcrypt
    const isUsernamelExist = await UserService.findUserByEmail(email)
    if (isUsernamelExist)
      return res.status(400).json({ error: 'Username already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      firstName,
      email,
      password: hashedPassword,
      username,
    })
    const user: any = await UserService.create(newUser)
    const token = UserService.generateToken(newUser)
    res.json({ token, ...user._doc })
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

export const LoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const user: any = await UserService.findUserByEmail(email)
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch)
        return next(new BadRequestError('Password is incorrect'))
      //generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        ' JWT_SECRET',
        {
          expiresIn: 3600, // expires in 1 hour
        }
      )

      res.json({ token, ...user._doc })
    } else {
      next(new NotFoundError('Username is not exist'))
    }
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}

export const findAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findAllUser())
  } catch (error) {
    next(new NotFoundError('Users not found', error))
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, id, firstName, lastName } = req.user as any
    const token = jwt.sign(
      {
        email,
        id,
        firstName,
      },
      JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )
    res.json({ token, id, firstName, lastName })
  } catch (error) {
    return next(new InternalServerError())
  }
}
