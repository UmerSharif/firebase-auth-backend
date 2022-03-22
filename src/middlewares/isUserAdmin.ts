import { Request, Response, NextFunction } from 'express'

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IGetUserAuthInfoRequest extends Request {
  user?: any // or any other type
}

export const isUserAdmin = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(400).json({
      message: 'Operation unsuccessful, you are not an admin!',
    })
  }
}
