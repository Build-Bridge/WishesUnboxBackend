/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import isAuthenticated from '../middlewares/checkAuth'
import { createCard, deleteCard, getCardById, updateCard, shareCard, scheduleCard } from '../controllers/cardC'

const router = express.Router()

// create card
router.post('/card/create', isAuthenticated, createCard)

// get card by id
router.get('/card/:id', getCardById)

// update card by id
router.put('/card/:id', isAuthenticated, updateCard)

// delete card
router.delete('/card/:id', isAuthenticated, deleteCard)

// share created card
router.post('/card/:id/share', isAuthenticated, shareCard)

// schedule card sending
router.post('/card/:id/schedule', isAuthenticated, scheduleCard)

export default router
