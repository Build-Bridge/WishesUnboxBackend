/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { signup, login } from '../controllers/auth'

const router = express.Router()

// basic user signup
router.post('/signup', signup)

// basic user login
router.post('/login', login)

export default router
