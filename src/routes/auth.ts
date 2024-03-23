/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { signup, login, forgotPassword, resetPassword } from '../controllers/auth'
import passport from 'passport'
import isAuthenticated from '../middlewares/checkAuth'

/**
 * Express router for handling authentication routes.
 */
const router = express.Router()

/**
 * @swagger
 * path:
 *   /signup:
 *     post:
 *       summary: Basic user signup
 *       description: Signup user with username, email, and password
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - firstName
 *                 - lastName
 *                 - email
 *                 - userName
 *                 - password
 *                 - dateOfBirth
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: User's first name
 *                 lastName:
 *                   type: string
 *                   description: User's last name
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                 userName:
 *                   type: string
 *                   description: Username for login
 *                 password:
 *                   type: string
 *                   description: User's password
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                   description: User's date of birth
 *       responses:
 *         201:
 *           description: User created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     description: JWT token for authentication
 *         400:
 *           description: User already exists
 *         500:
 *           description: Internal server error
 */
router.post('/signup', signup)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Basic user login
 *     description: Login user with email or username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrUsername
 *               - password
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Please enter email and password
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', login)

/**
 * @swagger
 * /forgotpassword:
 *   post:
 *     summary: Forgot password
 *     description: Generate a reset password token and send it to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent to user with reset password token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Error sending email
 */
router.post('/forgotpassword', forgotPassword)

/**
 * @swagger
 * /resetpassword/{resettoken}:
 *   put:
 *     summary: Reset password
 *     description: Reset user's password using the reset token
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid reset token or password does not match
 */
router.put('/resetpassword/:resettoken', resetPassword)

// google auth

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Google authentication
 *     description: Redirects to Google for authentication
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get('/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next)
})

/**
 * @swagger
 * /google/redirect:
 *   get:
 *     summary: Google authentication callback
 *     description: Handles the callback from Google after authentication
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Google login failed
 */
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/google' }), (req: express.Request, res: express.Response) => {
  return (req.user !== null)
    ? res.status(200).json({ message: 'Google login successful' })
    : res.status(401).json({ message: 'Google login failed' })
})

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout user
 *     description: Logout the authenticated user and clear the JWT token
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Logout failed
 */
router.get('/logout', isAuthenticated, (req, res) => {
  res.clearCookie('token') // clear jwt cookie if it exists
  req.logout((err) => {
    if (err !== null) return res.status(500).json({ message: 'Logout failed.' })
  })
  res.status(200).json({ message: 'Logout successful.' })
})

export default router
