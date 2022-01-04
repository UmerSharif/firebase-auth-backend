import {Request, Response, NextFunction} from 'express'
import admin from 'firebase-admin'
export default function checkAuth(req: Request, res: Response, next: NextFunction) {
	console.log(req.headers)
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken as any)
      .then(() => {
        next()
      })
      .catch(() => {
        res.status(403).send('Unauthorized')
      })
  } else {
    res.status(403).send('Unauthorized')
  }
}
