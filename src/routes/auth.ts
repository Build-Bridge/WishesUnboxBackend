/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { signup, login, forgotPassword, resetPassword } from '../controllers/auth'

const router = express.Router()

// basic user signup
router.post('/signup', signup)

// basic user login
router.post('/login', login)

// forgot password
router.post('/forgotpassword', forgotPassword)

// reset password
router.put('/resetpassword/:resettoken', resetPassword)

export default router
