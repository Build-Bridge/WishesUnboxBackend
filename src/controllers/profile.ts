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


// update user profile
export const updateUserProfile = asyncErrors(async (req: any, res: any, next: any): Promise<void> => {
  if (req.user.id !== req.params.id) return next(new ErrorHandler('Not authorized to update this user', 401))
  const user = await User.findById(req.params.id)
  if (user === null) return next(new ErrorHandler('User not found', 404))
  const { firstName, lastName, email, userName, dateOfBirth} = req.body

  const updateData = {
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    email: email || user.email,
    userName: userName || user.userName,
    dateOfBirth: dateOfBirth || user.dateOfBirth
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
  res.status(200).json({ success: true, user: updatedUser})
})

// update password
export const updatePassword = asyncErrors(async (req: any, res: any, next: any): Promise<void> => {
  const user = await User.findById(req.user._id).select('+password')
  if (!user) return next(new ErrorHandler('User not found', 404))

  const { oldPassword, newPassword } = req.body

  const isPasswordValid = user.validatePassword(oldPassword)
  if (!isPasswordValid) return next(new ErrorHandler('Incorrect old password', 401))

  if (oldPassword === newPassword) {
    return next(new ErrorHandler('Enter a new password', 400))
  }
  user.password = newPassword
  await user.save()
  res.status(200).json({ success: true, message: 'Password updated successfully' })
})
