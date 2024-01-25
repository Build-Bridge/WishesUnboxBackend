import User from '../models/user'
import asyncErrors from '../middlewares/asyncError'
import ErrorHandler from '../utils/errorHandler'

// get user profile
export const getUserProfile = asyncErrors(async (req: any, res: any): Promise<void> => {
  const user = await User.findById(req.user?.id)
  res.status(200).json({ success: true, user })
})

// get user by id
export const getUserById = asyncErrors(async (req: any, res: any, next: any): Promise<void> => {
  const user = await User.findById(req.params.id)
  if (user === null) return next(new ErrorHandler('User not found', 404))
  res.status(200).json({ success: true, user })
})

// get user by username
export const getUserByUserName = asyncErrors(async (req: any, res: any, next: any): Promise<void> => {
  const user = await User.findOne({ userName: req.params.username })
  if (user === null) return next(new ErrorHandler('User not found', 404))
  res.status(200).json({ success: true, user })
})
