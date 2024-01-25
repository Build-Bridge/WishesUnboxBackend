import express, { type Request, type Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/error'
import passport from './config/passport-setup'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'

const app = express()

// Body parser
app.use(express.json())
app.use(cookieParser())

app.use(passport.initialize())

// CORS
app.use(cors({
  credentials: true // allow cookies from frontend
}))

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Wishes Unbox backend')
})

app.use(authRoutes)
app.use(profileRoutes)

// Error handler
app.use(errorHandler)
export default app
