import express, { type Request, type Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/error'
import passport from './config/passport-setup'
import session from 'express-session'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'

const app = express()

// Body parser
app.use(express.json())
app.use(cookieParser())

app.use(session({
  secret: process.env.SESSION_SECRET ?? 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true for production
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}))

// passport setup
app.use(passport.initialize())
app.use(passport.session())

// CORS
app.use(cors({
  credentials: true // allow cookies from frontend
}))

// root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Wishes Unbox backend')
})

app.use(authRoutes)
app.use(profileRoutes)

// Error handler
app.use(errorHandler)
export default app
