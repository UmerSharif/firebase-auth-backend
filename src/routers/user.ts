import express, { Response, Request } from 'express'
import passport from 'passport'
// let GoogleTokenStrategy = require('passport-google-id-token')

import {
  createUser,
  authenticate,
  findAllUser,
  LoginUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
//  router.get('/', findAll)
router.post('/', createUser)
router.post('/login', LoginUser)
//  router.get('/', findAllUser)
router.get('/', passport.authenticate('jwt', { session: false }), findAllUser)
// router.post(
//   '/google-authenticate',
//   passport.authenticate('google-id-token', { session: false }),
//   authenticate
// )

export default router
