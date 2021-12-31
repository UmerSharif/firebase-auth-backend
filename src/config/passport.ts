/* eslint-disable @typescript-eslint/no-var-requires */
// import GoogleTokenStrategy from 'passport-google-id-token'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jsonwebtoken'
const GoogleTokenStrategy = require('passport-google-id-token')

import userService from '../services/user'
import { JWT_SECRET } from '../util/secrets'

export const googleStrategy = new GoogleTokenStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
  },
  async function (parsedToken: any, googleId: string, done: any) {
    console.log(parsedToken)

    const userPayload = {
      email: parsedToken?.payload?.email,
      firstName: parsedToken?.payload?.given_name,
      lastName: parsedToken?.payload?.family_name,
    }
    try {
      const user = await userService.findOrCreate(userPayload)
      done(null, user)
    } catch (e) {
      done(e)
    }
  }
)

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: any, done: any) => {
    console.log('helloooo')
    const userEmail = payload.email
    const foundUser = await userService.findUserByEmail(userEmail)
    done(null, foundUser)
  }
)
