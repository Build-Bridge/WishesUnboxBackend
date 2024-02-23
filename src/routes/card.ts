/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import isAuthenticated from '../middlewares/checkAuth'
import { createCard, deleteCard, getCardById, updateCard } from '../controllers/cardC'

const router = express.Router()

// create card
router.post('/card/create', isAuthenticated, createCard)
router.get('/card/:id', getCardById)
router.put('/card/:id', isAuthenticated, updateCard)
router.delete('/card/:id', isAuthenticated, deleteCard)

export default router
