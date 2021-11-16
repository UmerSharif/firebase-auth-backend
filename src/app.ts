import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'
import compression from 'compression'
import cors from 'cors'
import passport from 'passport'

import { googleStrategy } from './config/passport'
import userRouter from './routers/user'
import movieRouter from './routers/movie'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)
app.use(apiContentType)
// Use common 3rd-party middlewares
app.use(passport.initialize())
app.use(passport.session())
app.use(compression())
app.use(express.json())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(cors())

// Use movie router
passport.use(googleStrategy)
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/users', userRouter)
// Custom API error handler
app.use(apiErrorHandler)

export default app
