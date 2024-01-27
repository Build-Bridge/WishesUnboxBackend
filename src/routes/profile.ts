/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { getUserProfile, getUserById, getUserByUserName, updateUserProfile, updatePassword } from '../controllers/profile'
import isAuthenticated from '../middlewares/checkAuth'

const router = express.Router()

// get current user profile
router.get('/user/me', isAuthenticated, getUserProfile)

// get user by id
router.get('/user/id/:id', isAuthenticated, getUserById)

// update user profile
router.put('/user/id/:id', isAuthenticated, updateUserProfile)

// get user by username
router.get('/user/:username', isAuthenticated, getUserByUserName)

// update user password
router.put('/user/password/update', isAuthenticated, updatePassword)

export default router
