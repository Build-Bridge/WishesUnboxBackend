/* eslint-disable @typescript-eslint/no-unsafe-argument */
import asyncError from '../middlewares/asyncError'
import nodeSchedule from 'node-schedule'
import ErrorHandler from '../utils/errorHandler'
import Card from '../models/card'
import sendCard from '../utils/shareCard'

// create card
export const createCard = asyncError(async (req: any, res: any, next: any): Promise<void> => {
  const sender = req.user.id
  try {
    const { receiver, email, wish, occasion } = req.body
    const card = await Card.create({ receiver, email, wish, occasion, sender })
    res.status(201).json({ success: true, card })
  } catch (error: Error | any) {
    return next(new ErrorHandler(error.message as string, 500))
  }
})

// get card by id
export const getCardById = asyncError(async (req: any, res: any, next: any): Promise<void> => {
  try {
    const card = await Card.findById(req.params.id)
    if (card === null) return next(new ErrorHandler('Card not found', 404))
    res.status(200).json({ success: true, card })
  } catch (error: Error | any) {
    return next(new ErrorHandler(error.message as string, 500))
  }
})

// update card by id
export const updateCard = asyncError(async (req: any, res: any): Promise<void> => {
  const { receiver, email, wish, occasion } = req.body
  const updatedCard = await Card.findOneAndUpdate(
    { _id: req.params.id, sender: req.user.id },
    { receiver, email, wish, occasion },
    { new: true, runValidators: true, upsert: false }
  )

  if (updatedCard === null) {
    return res.status(404).json({ success: false, message: 'Card not found or you are not authorized to update this card' })
  }

  res.status(200).json({ success: true, updatedCard })
})

// delete card by id
export const deleteCard = asyncError(async (req: any, res: any): Promise<void> => {
  const deletedCard = await Card.findOneAndDelete({ _id: req.params.id, sender: req.user.id })
  if (deletedCard === null) {
    return res.status(404).json({ success: false, message: 'Card not found or you are not authorized to delete this card' })
  }
  res.status(200).json({ success: true, message: 'Card deleted successfully' })
})

// send card by id using email
export const shareCard = asyncError(async (req: any, res: any, next: any): Promise<void> => {
  const card = await Card.findById(req.params.id)
  if (card === null) return next(new ErrorHandler('Card not found', 404))
  const cardLink = `${req.protocol}://${req.get('host')}/card/${card._id}`

  try {
    await sendCard(card, cardLink, res)
  } catch (err: Error | any) {
    return next(new ErrorHandler('Fail to send mail', 500))
  }
})

// schedule email to send card by id
export const scheduleCard = asyncError(async (req: any, res: any, next: any): Promise<void> => {
  const card = await Card.findById(req.params.id)
  if (card === null) return next(new ErrorHandler('Card not found', 404))
  const cardLink = `${req.protocol}://${req.get('host')}/card/${card._id}`

  // get send date from user
  const { date, time } = req.body
  const sendAt = new Date(`${date}T${time}Z`)

  // create the schedule job
  nodeSchedule.scheduleJob(sendAt, async function () {
    try {
      await sendCard(card, cardLink, res)
    } catch (err) {
      res.status(500).json({ success: false, message: 'Fail to send scheduled mail' })
    }
  })
})
