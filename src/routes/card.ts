/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import isAuthenticated from '../middlewares/checkAuth'
import { createCard, deleteCard, getCardById, updateCard, shareCard, scheduleCard } from '../controllers/cardC'

const router = express.Router()

/**
 * @swagger
 * /card/create:
 *   post:
 *     summary: Create a new card
 *     description: Create a new card with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver
 *               - email
 *               - wish
 *               - occasion
 *             properties:
 *               receiver:
 *                 type: string
 *               email:
 *                 type: string
 *               wish:
 *                 type: string
 *               occasion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 card:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.post('/card/create', isAuthenticated, createCard)

/**
 * @swagger
 * /card/{id}:
 *   get:
 *     summary: Get card by ID
 *     description: Retrieve a card by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 card:
 *                   type: object
 *       404:
 *         description: Card not found
 *       500:
 *         description: Server error
 */
router.get('/card/:id', getCardById)

/**
 * @swagger
 * /card/{id}:
 *   put:
 *     summary: Update card by ID
 *     description: Update the details of a card by its ID
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
 *               receiver:
 *                 type: string
 *               email:
 *                 type: string
 *               wish:
 *                 type: string
 *               occasion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 updatedCard:
 *                   type: object
 *       404:
 *         description: Card not found or not authorized to update
 */
router.put('/card/:id', isAuthenticated, updateCard)

/**
 * @swagger
 * /card/{id}:
 *   delete:
 *     summary: Delete card by ID
 *     description: Delete a card by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted successfully
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
 *         description: Card not found or not authorized to delete
 */
router.delete('/card/:id', isAuthenticated, deleteCard)

/**
 * @swagger
 * /card/{id}/share:
 *   post:
 *     summary: Share a card
 *     description: Share a card by sending it via email
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
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
 *         description: Card not found
 *       500:
 *         description: Fail to send mail
 */
router.post('/card/:id/share', isAuthenticated, shareCard)

/**
 * @swagger
 * /card/{id}/schedule:
 *   post:
 *     summary: Schedule card sharing
 *     description: Schedule a card to be shared via email at a specific time. Timezone must be specified
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
 *             required:
 *               - date
 *               - time
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 format: time with timezone specified
 *     responses:
 *       200:
 *         description: Email scheduling set up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/card/:id/schedule', isAuthenticated, scheduleCard)

export default router
