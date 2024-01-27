/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { signup, login, forgotPassword, resetPassword } from '../controllers/auth'
import passport from 'passport'
import isAuthenticated from '../middlewares/checkAuth'

const router = express.Router()

// basic user signup
router.post('/signup', signup)

// basic user login
router.post('/login', login)

// forgot password
router.post('/forgotpassword', forgotPassword)

// reset password
router.put('/resetpassword/:resettoken', resetPassword)

// google auth

router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next)
})

// google callback
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/google' }), (req: express.Request, res: express.Response) => {
  return (req.user !== null)
    ? res.status(200).json({ message: 'Google login successful' })
    : res.status(401).json({ message: 'Google login failed' })
})

// logout user
router.get('/logout', isAuthenticated, (req, res) => {
  res.clearCookie('token') // clear jwt cookie if it exists
  req.logout((err) => {
    if (err !== null) return res.status(500).json({ message: 'Logout failed.' })
  })
  res.status(200).json({ message: 'Logout successful.' })
})

export default router
