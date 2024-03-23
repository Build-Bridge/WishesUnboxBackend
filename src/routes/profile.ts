/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { getUserProfile, getUserById, getUserByUserName, updateUserProfile, updatePassword } from '../controllers/profile'
import isAuthenticated from '../middlewares/checkAuth'

const router = express.Router()

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the profile of the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/user/me', isAuthenticated, getUserProfile)

/**
 * @swagger
 * /user/id/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve the profile of a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found
 */
router.get('/user/id/:id', isAuthenticated, getUserById)

/**
 * @swagger
 * /user/id/{id}:
 *   put:
 *     summary: Update user profile
 *     description: Update the profile of a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               userName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       401:
 *         description: Not authorized to update this user
 *       404:
 *         description: User not found
 */
router.put('/user/id/:id', isAuthenticated, updateUserProfile)

/**
 * @swagger
 * /user/{username}:
 *   get:
 *     summary: Get user by username
 *     description: Retrieve the profile of a user by their username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found
 */
router.get('/user/:username', isAuthenticated, getUserByUserName)

/**
 * @swagger
 * /user/password/update:
 *   put:
 *     summary: Update user password
 *     description: Update the password of the currently authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 default: johndoe123
 *               newPassword:
 *                 type: string
 *                 default: johndoe2346
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Enter a new password
 *       401:
 *         description: Incorrect old password
 *       404:
 *         description: User not found
 */
router.put('/user/password/update', isAuthenticated, updatePassword)

export default router
