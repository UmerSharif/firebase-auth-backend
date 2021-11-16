import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '../util/secrets'
import jwt from 'jsonwebtoken'
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
    const payload = req.body

    await UserService.create(payload)
    res.json(payload)
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
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
